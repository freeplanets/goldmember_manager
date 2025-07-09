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

export const VERIFY_CODE_MESSAGE = '林口高爾夫球場管理系統認證碼[{CODE}],請勿分享他人。';
export const USERNAME_STYPE = new RegExp(/^((?=.{6,15}$)(?=.*\d).*|(?=.{6,15}$)(?=.*[a-zA-Z]).*|(?=.{6,15}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*|(?=.{6,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!\u0022#$%&'()*+,./:;<=>?@[\]\^_`{|}~-]).*)/);
export const PASSWORD_STYLE = new RegExp(/^((?=.{6,15}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*|(?=.{6,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!\u0022#$%&'()*+,./:;<=>?@[\]\^_`{|}~-]).*)/);
export const PHONE_STYLE = new RegExp(/^09\d{8}(#\d+)?$/);
//export const DATE_STYLE = new RegExp(/^\d{4}\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])$/);   // YYYY/MM/DD
export const DATE_STYLE = new RegExp(/^((19|20)?[0-9]{2}[/](0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01]))$/); // YYYY/MM/DD
export const TIME_STYLE = new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/); // 00:00 - 23:59
export const EMAIL_STYLE = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
export const KS_MEMBER_STYLE_FOR_SEARCH = new RegExp(/^[1256]\d{2,3}$/); //3個數字即可查詢
export const KS_SHAREHOLDER_STYLE_FOR_SEARCH = new RegExp(/^[15]\d{2,3}$/); //3個數字即可查詢
export const KS_DEPENDENTS_STYLE_FOR_SEARCH = new RegExp(/^[26]\d{2,3}$/); //3個數字即可查詢
export const PHONE_STYLE_FOR_SEARCH = new RegExp(/^09\d{1,8}(#\d+)?$/); //3個數字即可查詢

export const PASSWORD_RETRY_COUNT = 5;
export const PASSWORD_RETRY_TIME = 1800000; // 3分鐘