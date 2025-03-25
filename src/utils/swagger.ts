import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

//即使刷新網頁，Token 值仍保持不變
const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};

/**
 * @author Ryan
 * @description Swagger 環境
 */
export const setupSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('林口高爾夫球場雲端管理系統 API')
    .setDescription('林口高爾夫球場雲端管理系統的後端 API 規格文件。')
    .setVersion('1.0.0')
    .addServer('https://virtserver.swaggerhub.com/cyriacr/LinkouGolfClubAPI/1.0.0')
    .addServer('https://api.uuss.net/linkougolf')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document, swaggerCustomOptions);
}