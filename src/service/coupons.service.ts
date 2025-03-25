import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CommonError } from '../utils/common-exception';
import { ERROR_TYPE } from '../utils/enum';
import { ERROR_MESSAGE, STATUS_CODE } from '../utils/constant';
import { CouponBatchRequestDto } from '../dto/coupons/coupon-batch-request.dto';
import { CouponBatchPostDto } from '../dto/coupons/coupon-batch-post.dto';
import { CouponRequestDto } from '../dto/coupons/coupon-request.dto';

@Injectable()
export class CouponsService {
  coupons(
    couponRequestDto: CouponRequestDto,
    req: Request,
  ): Promise<any> {
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

  couponsCode(code: string, req: Request): Promise<any> {
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

  couponsCodeUse(id: string, req: Request): Promise<any> {
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

  couponsCodeConvertToPaper(code: string, req: Request): Promise<any> {
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

  couponBatches(couponBatchRequestDto: CouponBatchRequestDto, req: Request): Promise<any> {
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

  couponBatchesPost(
    couponBatchPostDto: CouponBatchPostDto,
    req: Request,
  ): Promise<any> {
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

  couponBatchedId(id: string, req: Request): Promise<any> {
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

  couponBatchedIdPut(
    id: string,
    couponBatchPostDto: CouponBatchPostDto,
    req: Request,
  ): Promise<any> {
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

  couponBatchedIdAuthorize(id: string, req: Request): Promise<any> {
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

  couponBatchedIdCancel(id: string, req: Request): Promise<any> {
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
