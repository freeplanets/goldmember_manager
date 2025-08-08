import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { IUser, IUserAccessLog } from '../dto/interface/user.if';
import { UserAccessLog, UserAccessLogSchema } from '../dto/schemas/user-access-log.schema';
import { getMongoDB } from '../utils/database/mongodb';
import { DateLocale } from '../classes/common/date-locale';
// import { CommonResponseDto } from '../dto/common-response.dto';
// import { ErrCode, ErrMsg } from '../utils/enumError';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger: Logger;
  private myDate = new DateLocale();
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
    this.saveAccessLog(req);
    next();
  }
  jwtValidate = (token:string) => {
    const jwt = new JwtService()
    const opt:JwtVerifyOptions = {
      secret: process.env.API_KEY,
    }
    return jwt.verify(token, opt); 
    // const isPassed = jwt.verify(token, opt);
    // console.log('jwtValidate', isPassed);
    // if (isPassed) {
    //   return jwt.decode(token);
    // }
    // return false;
  }
  getToken = (request:Request) => {
    const token =  request.header('WWW-AUTH') || request.header('Authorization');
    //const token =  request.header('Authorization');
    // console.log('extractTokenFromHeader:', token);
    if (token && (token.startsWith('Bearer ') || token.startsWith('bearer '))) {
        return token.slice(7); // Remove "Bearer " prefix
    }
    // console.log('extractTokenFromHeader:', token);
    return token ? token : undefined;  
  }  
  saveAccessLog = async (req: Request) => {
    try {
      const { body, query, path } = req;
      const db = await getMongoDB();
      const modelUAL = db.model(UserAccessLog.name, UserAccessLogSchema);
      const d=new Date();
      const log:Partial<IUserAccessLog> = {
        path: path,
        accessDate: this.myDate.toDateString(),
        accessTime: this.myDate.toTimeString(),
        accessTimeTS: d.getTime(),
      }
      if (body) log.body = body;
      if (query) log.query = query;
      if (body.username) {
        log.username = body.username;
      }
      const token = this.getToken(req);
      if (token) {
        log.token = token;
        const user:Partial<IUser> = this.jwtValidate(token);
        if (user) {
          log.username = user.username;
        }
      }
      await modelUAL.create(log);
    } catch (error) {
      console.log('saveAccessLog error:', error);
    }
  }  
}