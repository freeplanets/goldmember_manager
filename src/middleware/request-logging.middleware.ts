import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
// import { CommonResponseDto } from '../dto/common-response.dto';
// import { ErrCode, ErrMsg } from '../utils/enumError';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('Request');
  }
  use(req: Request, res: Response, next: NextFunction) {
    const { body, query, path, method } = req;
    this.logger.log(
      `客戶端請求訊息: [path] ${method} ${path} , [Request Data] body: ${JSON.stringify(
        body,
      )}, query: ${JSON.stringify(query)}`,
    );
    // if (path.indexOf('auth/login') !== -1) {
    //   console.log('Path:', path, 'checked');
    // } else {
    //   const token = req.header('WWW-AUTH');
    //   console.log("token", token);
    //   const userInfo = this.jwtValidate(token);
    //   if (userInfo) {
    //     res.locals.user = userInfo;
    //   } else {
    //     const commonRes = new CommonResponseDto();
    //     commonRes.errorcode = ErrCode.TOKEN_ERROR;
    //     commonRes.error = {
    //       message: ErrMsg.TOKEN_ERROR,
    //     }
    //     res.send(HttpStatus.OK).json(commonRes);
    //   }
    // }
    next();
  }
  jwtValidate = (token:string) => {
    const jwt = new JwtService()
    const opt:JwtVerifyOptions = {
      secret: process.env.API_KEY,
    }
    const isPassed = jwt.verify(token, opt);
    console.log('jwtValidate', isPassed);
    if (isPassed) {
      return jwt.decode(token);
    }
    return false;
  }
}

