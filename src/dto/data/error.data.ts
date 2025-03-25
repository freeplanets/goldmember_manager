import { IsOptional, IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICommonError } from '../interface/common.if';

export class ErrorData implements ICommonError {
  @ApiProperty({
    description: '錯誤訊息',
    example: '',
  })
  message: string;

  @ApiProperty({
    description: '額外錯誤訊息',
    required: false,
  })
  @IsObject()
  extra?: object = {};
  // @ApiProperty({
  //   description: '錯誤代碼',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // code?: string;

  // @ApiProperty({
  //   description: '錯誤訊息',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // message?: string;

  // @ApiProperty({
  //   description: '詳細錯誤資訊',
  //   required: false,
  // })
  // @IsOptional()
  // @IsObject()
  // details?: object;
}
