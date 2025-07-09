import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../src/module/auth.module';
import { AuthLoginRequestDto } from '../src/dto/auth/auth-login-request.dto';
import { AuthService } from '../src/service/auth.service';
import { User } from '../src/dto/schemas/user.schema';
import { Model } from 'mongoose';
import { COUPON_BATCH_ISSUANCE_METHOD, COUPON_BATCH_STATUS, MEMBER_GROUP, SmsCodeUsage } from '../src/utils/enum';
import { CouponsModule } from '../src/module/coupons.module';
import { CouponBatchListRequestDto } from '../src/dto/coupons/coupon-batch-list-request.dto';
import { CouponBatchPostDto } from '../src/dto/coupons/coupon-batch-post.dto';
import { DateWithLeadingZeros } from '../src/utils/common';
import { CouponRequestDto } from '../src/dto/coupons/coupon-request.dto';

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
        CouponsModule,
      ],
      // providers: [
      //   {
      //     provide: AuthService,
      //     useFactory: () => ({
      //       authLogin: jest.fn(),
      //       sendSmsCode: jest.fn(),
      //       getCaptcha: jest.fn(),
      //       authResetPassword: jest.fn(),
      //     }),
      //   },
      // ],
    }).compile();
    service = moduleFixture.get<AuthService>(AuthService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  const fingerprint = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWl2Y2VCcmFuZCI6IkFwcGxlIiwiZGV2aWNlTW9kZWwiOiJpUGhvbmUiLCJkZXZpY2VOYW1lIjoiQXBwbGUgaVBob25lIFNhZmFyaSIsImRldmljZUlkIjoiMWRjYTMxNTktNDY1YS00OGRlLWIyNDgtOTcwNmUxNzY2MDAxIiwic3lzdGVtTmFtZSI6IlNhZmFyaSIsInN5c3RlbVZlcnNpb24iOiIxNi42IiwiaWF0IjoxNzQ1ODA1MDEwfQ.x2JGeaVAGmqsYIDiTQVRcnF_FFqYrafjIG_AM8kFngY';
  let token = '';
  let couponBatchedId = '';
  let couponId = '';
  it('/auth/login (POST) 登入', () => {
      const auth:AuthLoginRequestDto = {
      username: 'james',
      password: 'Abc12345',
      totpCode: '675163',
      fingerprint,
      }
      return request(app.getHttpServer())
      .post('/auth/login')
      .send(auth)
      .expect(200)
      .expect(res=> {
          console.log('res:', res.body);
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('token');
          expect(res.body.data).toHaveProperty('refreshToken');
          expect(res.body.data).toHaveProperty('deviceRefreshToken');
          token = res.body.data.token;
      });
  });

  it('/couponbatches (POST) 新增優惠券批次', () => {
    const data:CouponBatchPostDto = {
      name: '測試券',
      type: 'test',
      issueMode: COUPON_BATCH_ISSUANCE_METHOD.MANUAL,
      targetGroups: [
        MEMBER_GROUP.DEPENDENTS,
      ],
      issueDate: DateWithLeadingZeros(),
      couponsPerPerson: 1,
      validityMonths: 1,
    }
    return request(app.getHttpServer())
      .post('/couponbatches')
      .set('Authorization', `Bearer ${token}`)
      .send(data)
      .expect(200)
      .expect(res=>{
        console.log('/couponbatches (POST) 新增優惠券批次', res.body);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toMatchObject(res.body.data);
        couponBatchedId = res.body.data[0].id;
        console.log('新增優惠券批次:', couponBatchedId);
      })
  })

  it('/couponbatches/coupon (post) 取得優惠券列表', () => {
    const data:CouponRequestDto = {
      batchId: couponBatchedId,
    }
    return request(app.getHttpServer())
      .post('/couponbatches/coupon')
      .set('Authorization', `Bearer ${token}`)
      .send(data)
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toMatchObject(res.body.data);
        couponId = res.body.data[0].id;
        console.log('取得優惠券列表 couponId', couponId);
      })
  })

  it('GET /couponbatches/coupon/{id} 取得優惠券詳細資料', () => {
    return request(app.getHttpServer())
      .get(`/couponbatches/coupon/${couponId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        console.log('取得優惠券詳細資料', res.body)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toMatchObject(res.body.data)
        expect(res.body.data.id).toMatch(couponId);
      });
  })

  it('POST /couponbatches/authorize/{id} 授權發放優惠券批次', () => {
    return request(app.getHttpServer())
      .post(`/couponbatches/authorize/${couponBatchedId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        console.log('授權發放優惠券批次', res.body);
        expect(res.body).toMatchObject({});
      });    
  })

  it('/couponbatches/list (POST)', () => {
    const data:CouponBatchListRequestDto = {
      status: COUPON_BATCH_STATUS.NOT_ISSUED,
    }
    return request(app.getHttpServer())
      .post('/couponbatches/list')
      .set('Authorization', `Bearer ${token}`)
      .send(data)
      .expect(200)
      .expect(res => {
          console.log('res:', res.body);
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toMatchObject(res.body.data);
          couponBatchedId = res.body.data[0].id; 
      })
  })

  it('/couponbatched/{id} GET', () => {
    return request(app.getHttpServer())
      .get(`/couponbatches/${couponBatchedId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res=> {
        console.log('/couponbatched/{id} res:', res.body);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.id).toBe(couponBatchedId);
      })
  })
  afterAll(async () => {
    console.log('close app');
    await app.close();
  });
});
