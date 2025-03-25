import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/all-exception.filter';
import { CommonExceptionFilter } from './utils/common-exception.filer';
import { setupSwagger } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpAdapter = app.get(HttpAdapterHost);

  //連接異常過濾器
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter, new Logger('AllExceptions')),
    new CommonExceptionFilter(httpAdapter, new Logger('CommonException')),
  );

  //Global Middleware Setup -> 啟用 Cors 屬性
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    optionsSuccessStatus: 200,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * whitelist: 任何不在 DTO 中的屬性都會被無條件過濾掉。
       * forbidNonWhitelisted: 전달하는 요청 값 중에 정의 되지 않은 값이 있으면 Error를 발생합니다.
       * transform: 如果傳遞的任何請求值未定義，則會引發錯誤。
       *            如果要自動將物件轉換為 DTO，請將 transform 值設為 true。
       * disableErrorMessages: 設定發生錯誤時是否顯示錯誤訊息（true：不顯示，false：顯示）
       *                       在部署環境中，建議將其設為 true。
       */
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  //Swagger 連結偏好
  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
