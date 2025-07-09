import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../src/module/auth.module';
import { AuthLoginRequestDto } from '../src/dto/auth/auth-login-request.dto';
import { ErrCode } from '../src/utils/enumError';
import { AuthService } from '../src/service/auth.service';
import { User } from '../src/dto/schemas/user.schema';
import { Model } from 'mongoose';
import { AuthSMSRequestDto } from '../src/dto/auth/auth-sms-request.dto';
import { AuthResetPasswordRequestDto } from '../src/dto/auth/auth-reset-password-request.dto';
import { SmsCodeUsage } from '../src/utils/enum';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let service: AuthService;
  let userModel: Model<User>
  const username = process.env.LMONGO_USER;
  const password = process.env.LMONGO_PASS;
  const resource = process.env.LMONGO_HOST;
  const port =process.env.LMONGO_PORT;
  const rpSet = process.env.LMONGO_REPLICA_SET;
  //const dbase = process.env.LMONGO_DB
  const encodePassword = encodeURIComponent(password);
  const uri = `mongodb://${username}:${encodePassword}@${resource}:${port}/?retryWrites=true&w=majority&replicaSet=${rpSet}`;
  console.log('uri:', uri);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri, {
            dbName: process.env.LMONGO_DB,
            directConnection: true,
            connectTimeoutMS: 5000,
        }),
        AuthModule,
      ],
      providers: [
        {
          provide: AuthService,
          useFactory: () => ({
            authLogin: jest.fn(),
            sendSmsCode: jest.fn(),
            getCaptcha: jest.fn(),
            authResetPassword: jest.fn(),
          }),
        },
      ],
    }).compile();
    service = moduleFixture.get<AuthService>(AuthService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  const fingerprint = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWl2Y2VCcmFuZCI6IkFwcGxlIiwiZGV2aWNlTW9kZWwiOiJpUGhvbmUiLCJkZXZpY2VOYW1lIjoiQXBwbGUgaVBob25lIFNhZmFyaSIsImRldmljZUlkIjoiMWRjYTMxNTktNDY1YS00OGRlLWIyNDgtOTcwNmUxNzY2MDAxIiwic3lzdGVtTmFtZSI6IlNhZmFyaSIsInN5c3RlbVZlcnNpb24iOiIxNi42IiwiaWF0IjoxNzQ1ODA1MDEwfQ.x2JGeaVAGmqsYIDiTQVRcnF_FFqYrafjIG_AM8kFngY';

  it('/auth/login (POST)', () => {
    const auth:AuthLoginRequestDto = {
      username: 'james',
      password: '12345678',
      fingerprint,
    }
    return request(app.getHttpServer())
      .post('/auth/login').send(auth)
      .expect(200)
      .expect(res=> {
        console.log('res:', res.body);
        expect(res.body).toHaveProperty('errorcode');
        expect(res.body.errorcode).toBe(ErrCode.ACCOUNT_OR_PASSWORD_ERROR);
      });
  });
  it('/auth/login (POST)', () => {
    const auth:AuthLoginRequestDto = {
      username: 'james',
      password: 'Abc12345',
      fingerprint,
    }
    return request(app.getHttpServer())
      .post('/auth/login').send(auth)
      .expect(200)
      .expect(res=> {
        console.log('res:', res.body);
        expect(res.body).toHaveProperty('errorcode');
        expect(res.body.errorcode).toBe(ErrCode.VERIFY_CODE_ERROR);
      });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return IMG who has no 2Fa', async () => {
      const authLogin:AuthLoginRequestDto = {
          username: 'testman',
          password: '123456',
          fingerprint,
      }
      const ans = await service.authLogin(authLogin, '::1');
      console.log('IMG test:', ans)
      expect(ans.data).toBeDefined();
      expect(ans.data.totpIMG).toBeDefined();
      // expect(typeof ans.data.token).toBe('string');
      // expect(typeof ans.data.refreshToken).toBe('string');
  });

  it('should return account error', async () => {
      const authRequestDto:AuthLoginRequestDto = {
          username: 'testman1',
          password: 'wrong-password',
          fingerprint,
      };
      const result = await service.authLogin(authRequestDto, '::1');
      expect(result).toBeDefined();
      expect(result.errorcode).toBe(ErrCode.ACCOUNT_OR_PASSWORD_ERROR);
  });

  it('should throw password error', async () => {
      const authRequestDto:AuthLoginRequestDto = {
          username: 'testman',
          password: 'wrong-password',
          fingerprint,
      };
      const result = await service.authLogin(authRequestDto, '::1');
      expect(result).toBeDefined();
      expect(result.errorcode).toBe(ErrCode.ACCOUNT_OR_PASSWORD_ERROR);
  });

  let captcha: string;
  let captchaId: string;
  it('should return a valid captcha', async () => {
      const verifyRes = await service.getCaptcha(true);
      // console.log('verifyRes:', verifyRes);
      expect(verifyRes).toBeDefined();
      expect(typeof verifyRes.data.captchaId).toBe('string');
      captcha = verifyRes.error.extra;
      captchaId = verifyRes.data.captchaId;
      console.log('captcha:', captcha, 'captchaId:', captchaId);
  });

  let verifyCode:string;
  it('should send sms successfully', async () => {
      const smsReq:AuthSMSRequestDto= {
          phone: '0936962772',
          captchaId: captchaId,
          captchaCode: captcha,
          codeUsage: SmsCodeUsage.RESET_PASS,
      }
      const result = await service.sendSmsCode(smsReq, true);
      expect(result).toBeDefined();
      expect(result.errorcode).toBe(undefined);
      verifyCode = result.error.extra;
  });

  it('should throw reset password phone error', async () => {
      const authResetPass:AuthResetPasswordRequestDto = {
          phone: '0936962770',
          newPassword: 'Abc12345',
          verificationCode: verifyCode,
      };
      const result = await service.authResetPassword(authResetPass);
      expect(result).toBeDefined();
      expect(result.errorcode).toBe(ErrCode.PHONE_ERROR);
  });

  it('should throw reset password verify code error', async () => {
      const authResetPass:AuthResetPasswordRequestDto = {
          phone: '0936962772',
          newPassword: 'Abc12345',
          verificationCode: '123456',
      };
      const result = await service.authResetPassword(authResetPass);
      expect(result).toBeDefined();
      expect(result.errorcode).toBe(ErrCode.VERIFY_CODE_ERROR);
  });

  it('should throw reset password ok', async () => {
      const authResetPass:AuthResetPasswordRequestDto = {
          phone: '0936962772',
          newPassword: 'Abc12345',
          verificationCode: verifyCode,
      };
      const result = await service.authResetPassword(authResetPass);
      expect(result).toBeDefined();
      expect(result.errorcode).toBe(undefined);
  });

  it('should throw sms error sms re-access to soon', async () => {
      const verifyRes = await service.getCaptcha(true);
      // console.log('verifyRes:', verifyRes);
      captcha = verifyRes.error.extra;
      captchaId = verifyRes.data.captchaId;
      console.log('captcha:', captcha, 'captchaId:', captchaId);

      const smsReq:AuthSMSRequestDto= {
          phone: '0936962772',
          captchaId: captchaId,
          captchaCode: captcha,
          codeUsage: SmsCodeUsage.RESET_PASS,
      };
      const result = await service.sendSmsCode(smsReq, true);
      expect(result).toBeDefined();
      expect(result.errorcode).toBe(ErrCode.SMS_CODE_TOO_FAST);
  });

  afterAll(async () => {
    console.log('close app');
    await app.close();
  });
});
