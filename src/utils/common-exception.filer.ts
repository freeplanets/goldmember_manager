import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CommonError } from './common-exception';
import * as dayjs from 'dayjs';
// import { Dayjs } from 'dayjs';
import { stringifyWithoutCircular } from './common';

/**
 * @Catch(CommonError)
 * 裝飾器將所需的元資料綁定到ExceptionFilter，
 * 該過濾器聲明告訴 Nset.js 它只尋找 CommonError 類型的異常。
 *
 * CommonError 會擷取業務邏輯中可能發生的錯誤並傳回給客戶端。
 */
@Catch(CommonError)
export class CommonExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger,
  ) {}

  /**
   * @author 
   * @description 例外處理函數
   *
   * @param commonError 目前正在處理的異常物件。
   * @param host ArgumentsHost 物件 -> 提供方法來檢索傳遞給處理程序的參數（如果使用 Express - 提供 Response & Request & Next）
   */
  catch(commonError: CommonError, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const {
      type,
      status,
      message: serverErrorMessage,
      clientErrorMessage,
    } = commonError;

    this.logger.debug(
      `${stringifyWithoutCircular({
        type,
        status,
        serverErrorMessage,
        clientErrorMessage,
      })}`,
    );

    /* 向客戶傳達訊息. */
    httpAdapter.reply(
      ctx.getResponse(),
      {
        common: {
          createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          status: commonError.status,
          message: clientErrorMessage,
        },
      },
      200,
    );
  }
}
