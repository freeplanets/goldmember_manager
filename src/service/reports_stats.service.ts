import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CommonError } from '../utils/common-exception';
import { ERROR_TYPE } from '../utils/enum';
import { ERROR_MESSAGE, STATUS_CODE } from '../utils/constant';

@Injectable()
export class ReportsStatsService {
  reportsStats(year: number, req: Request): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        resolve({});
      });
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }
}
