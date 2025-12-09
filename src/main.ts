import { ValidationPipe, Logger, ValidationPipeOptions } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/all-exception.filter';
import { CommonExceptionFilter } from './utils/common-exception.filer';
import { setupSwagger } from './utils/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { eventContext } from 'aws-serverless-express/middleware';
import { ValidationException } from './utils/validate/validation-exception';
import { GlobalDataTransPipe } from './utils/pipes/global-date-trans-pipe';

const authOption:SecuritySchemeObject = {
    description: 'JWT token authorization',
    //type: 'apiKey',
    type: 'http',
    // in: 'header',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    'x-tokenName': 'WWW-AUTH',
}

//即使刷新網頁，Token 值仍保持不變
const swaggerCustomOptions: SwaggerCustomOptions = {
    yamlDocumentUrl: 'docs-yaml',
    swaggerOptions: {
        persistAuthorization: true,
    },
};

async function bootstrap() {
  const expressApp = require('express')();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);
  const crosOp: CorsOptions = {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: false,
  }
  app.enableCors(crosOp);
  const options = new DocumentBuilder()
    .setTitle('GoldMember')
    .setDescription('Manager Api')
    .setVersion('0.01')
    //.addServer('/dev')
    .addBearerAuth(authOption)
    .build();
  
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, swaggerCustomOptions);
  app.use(eventContext());
  const vopt:ValidationPipeOptions = {
    exceptionFactory: ValidationException,
  };
  app.useGlobalPipes(new GlobalDataTransPipe(), new ValidationPipe(vopt));
  //Swagger 連結偏好
  //setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
