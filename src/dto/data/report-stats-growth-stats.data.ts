import { IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IMemberGrowth } from '../interface/report.if';

export class ReportStatsGrowthStatsData implements IMemberGrowth{
  @ApiProperty({
    description: '月份',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  month?: number;

  @ApiProperty({
    description: '一般會員',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  regularGrowth?: number;

  @ApiProperty({
    description: '股東',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  shareholderGrowth?: number;

  @ApiProperty({
    description: '眷屬',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  familyGrowth?: number;

  @ApiProperty({
    description: '一般會員活躍度',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  regularActivity?: number;

  @ApiProperty({
    description: '股東活躍度',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  shareholderActivity?: number;

  @ApiProperty({
    description: '眷屬活躍度',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  familyActivity?: number;
}
