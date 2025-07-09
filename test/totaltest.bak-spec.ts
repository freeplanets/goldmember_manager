import * as request from 'supertest';
import { Server } from "http";
import { AuthLoginRequestDto } from "../src/dto/auth/auth-login-request.dto";
import { bootstrapServer } from "../src/lambda";
import { INestApplication } from '@nestjs/common';
import { ErrCode } from '../src/utils/enumError';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Api Test (e2e)', () => {
    // let cachedServer:Server;
    let app:INestApplication<any>;
    process.env.IS_OFFLINE = 'IS_OFFLINE';
    // require('dotenv').config();
    // console.log(process.env);
    beforeEach(async ()=>{
        // const appServer =  await bootstrapServer();
        // cachedServer = appServer.cachedServer;
        // app = appServer.app;
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
            ],
        }).compile();
        app = module.createNestApplication();
        await app.init();
    });

    const fingerprint = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWl2Y2VCcmFuZCI6IkFwcGxlIiwiZGV2aWNlTW9kZWwiOiJpUGhvbmUiLCJkZXZpY2VOYW1lIjoiQXBwbGUgaVBob25lIFNhZmFyaSIsImRldmljZUlkIjoiMWRjYTMxNTktNDY1YS00OGRlLWIyNDgtOTcwNmUxNzY2MDAxIiwic3lzdGVtTmFtZSI6IlNhZmFyaSIsInN5c3RlbVZlcnNpb24iOiIxNi42IiwiaWF0IjoxNzQ1ODA1MDEwfQ.x2JGeaVAGmqsYIDiTQVRcnF_FFqYrafjIG_AM8kFngY';

    it('/auth/login (POST)', () => {
        const auth:AuthLoginRequestDto = {
        username: 'james',
        password: 'Abc12345',
        totpCode: '779797',
        fingerprint,
        }
        return request(app.getHttpServer())
        .post('/auth/login')
        //.set('x-apigateway-event', '1')
        //.set('x-apigateway-context', '1')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(auth)
        .expect(200)
        .expect(res=> {
            console.log('res:', res.body);
            expect(res.body).toHaveProperty('errorcode');
            expect(res.body.errorcode).toBe(ErrCode.ACCOUNT_OR_PASSWORD_ERROR);
        });
    });
});