import { Request } from 'express';
import { ICommonResponse, IOrganization } from '../dto/interface/common.if';
import { FAIRWAY_PATH, ORGANIZATION_TYPE } from './enum';
import { IStockInOutMark } from '../dto/interface/fertilizer.if';
import { DateLocale } from '../classes/common/date-locale';

/**
 * @author 
 * @description Common Status Code
 */
export const STATUS_CODE = {
  SUCCESS: 'success',
  FAIL: 'fail',
  DISASTER: 'disaster',
};

/**
 * @author 
 * @description 定義每個網域錯誤訊息
 */
export const ERROR_MESSAGE = {
  SERVER_ERROR: '請聯絡開發團隊。',
};
const default_organization:IOrganization = {
  id: 'linkougolf',
  type: ORGANIZATION_TYPE.COURT,
  name: '林口高爾夫球場',
}
export const ORGANIZATION = default_organization;

export const VERIFY_CODE_MESSAGE = '林口高爾夫球場管理系統認證碼[{CODE}],請勿分享他人。';
export const USERNAME_STYPE = new RegExp(/^((?=.{6,15}$)(?=.*\d).*|(?=.{6,15}$)(?=.*[a-zA-Z]).*|(?=.{6,15}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*|(?=.{6,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!\u0022#$%&'()*+,./:;<=>?@[\]\^_`{|}~-]).*)/);
export const PASSWORD_STYLE = new RegExp(/^((?=.{6,15}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*|(?=.{6,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!\u0022#$%&'()*+,./:;<=>?@[\]\^_`{|}~-]).*)/);
export const PHONE_STYLE = new RegExp(/^09\d{8}(#\d+)?$/);
//export const DATE_STYLE = new RegExp(/^\d{4}\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])$/);   // YYYY/MM/DD
export const DATE_STYLE = new RegExp(/^((19|20)?[0-9]{2}[/|-](0?[1-9]|1[012])[/|-](0?[1-9]|[12][0-9]|3[01]))$/); // YYYY/MM/DD
// export const DATE_DASH_STYLE = new RegExp(/^((19|20)?[0-9]{2}[-](0?[1-9]|1[012])[-](0?[1-9]|[12][0-9]|3[01]))$/); // YYYY-MM-DD
export const TIME_STYLE = new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/); // 00:00 - 23:59
export const EMAIL_STYLE = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
export const KS_MEMBER_STYLE_FOR_SEARCH = new RegExp(/^[1256]\d{2,3}$/); //3個數字即可查詢
export const KS_SHAREHOLDER_STYLE_FOR_SEARCH = new RegExp(/^[12]\d{2,3}$/); //3個數字即可查詢
export const KS_HUM_SHAREHOLDER_STYLE = new RegExp(/^1\d{3}$/); //自然人股東
export const KS_COM_SHAREHOLDER_STYLE = new RegExp(/^2\d{3}$/); //法人股東
export const KS_DEPENDENTS_STYLE_FOR_SEARCH = new RegExp(/^[56]\d{2,3}$/); //3個數字即可查詢
export const PHONE_STYLE_FOR_SEARCH = new RegExp(/^09\d{1,8}(#\d+)?$/); //3個數字即可查詢
export const INCLUDE_CHINESE = new RegExp(/[\u4E00-\u9FA5]+/, 'g'); //包含中文字檢查
export const ALL_CHINESE = new RegExp(/^[\u4E00-\u9FA5]+$/);  //全中文檢查
export const INCLUDE_ENGLISH = new RegExp(/^[a-zA-Z]+/); //包括英文
export const ALL_DIGITAL = new RegExp(/^[0-9]+$/);
export const UUID_V1_STYLE = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/, 'i');
export const UUID_V4_STYLE = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, 'i');


export const PASSWORD_RETRY_COUNT = 5;
export const PASSWORD_RETRY_TIME = 1800000; // 3分鐘
export const THREE_MONTH =  7776000000; // 1000*60*60*24*90 = 90天
export const REPLACE_YEAR = '{year}';
export const REPLACE_MONTH = '{month}';

export const COURSE_COMBINE = [
  [FAIRWAY_PATH.EAST, FAIRWAY_PATH.WEST],
  [FAIRWAY_PATH.SOUTH, FAIRWAY_PATH.EAST],
  [FAIRWAY_PATH.WEST, FAIRWAY_PATH.SOUTH]
];

export function needsBuffer(str: string): boolean {
  // 檢查是否有明顯亂碼（如不可見字元或常見亂碼範圍）
  // 這裡以出現不可見控制字元為例
  return /[\u0000-\u001F\u007F-\u009F]/.test(str);
}

export function AddTraceIdToResponse(res:ICommonResponse<any>, req:Request) {
  try {
    if (!res.error) res.error =  { extra: {} };
    else if (!res.error.extra) {
      res.error.extra = {};
    }
    res.error.extra.traceId = req['traceId'];
  } catch (err) {
    console.log('AddTraceIdToResponse err:', err);
    res['traceId'] = req['traceId'];
    console.log('AddTraceIdToResponse res:', res);
    //res.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
  }
  //return res;
}

export const IN_OUT_CAL_MARK:IStockInOutMark = {
  PURCHASE: {
    Title: '購買', 
    CalMark: 1,
  },
  PICK_UP: {
    Title: '領用',
    CalMark: -1,
  },
  RETURN: {
    Title: '退回', 
    CalMark: -1,
  }
}

export function getCallerName() {
  try {
    throw new Error();
  } catch (e) {
    // The stack trace format can vary slightly between environments.
    // This regex attempts to extract the function name from the relevant line.
    const stackLines = e.stack.split('\n');
    // The caller is typically found on the third line of the stack trace
    // (index 2, as the first line is the error message and the second is getCallerName itself).
    const callerLine = stackLines[2]; 
    const match = callerLine.match(/(?:at\s+)?(.*?)(?:\s+\(|@)/);
    return match ? match[1].trim() : 'Unknown';
  }
}
