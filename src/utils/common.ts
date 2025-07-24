import { isArray, isObject } from "class-validator";
import { IParameter } from "./settings/settings.if";

/**
 * @author 
 * @description 僅區分現有資料和已接收資料的功能。
 * @param object
 * @returns {Any} 資料可以以多種形式傳回，例如字串或數字。
 */
export const stringifyWithoutCircular = (object: any) => {
  let output = object;
  try {
    output = JSON.stringify(object, getCircularReplacer());
  } catch (e) {
    // intentional
  }
  return output;
};

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return null;
      }
      seen.add(value);
    }
    return value;
  };
};

export function getBirthMonth(birthday:string) {
  if (!birthday) return 0;
  let spt = "/";
  if (birthday.indexOf(spt) == -1) spt = "-";
  const pos1 = birthday.indexOf(spt);
  const pos2 = birthday.indexOf(spt, pos1+1)
  if (pos1 ==-1 || pos2 ==-1) return 0;
  let newStr = birthday.substring(pos1+1, pos2);
  return Number(newStr);
}

// return YYYY/MM/DD
export function DateWithLeadingZeros(date:string=new Date().toLocaleDateString('zh-TW')): string {
  const dd = date.split('/');
  const year = dd[0];
  const month = dd[1].padStart(2, '0');
  const day = dd[2].padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export function LocalDateTimeString() {
  const time = new Date().toLocaleTimeString('zh-tw', {hourCycle: 'h23'});
  const date = DateWithLeadingZeros();
  return `${date} ${time}`;
}

export function AddMonth(months:number, date:string|Date|undefined = undefined){
  if (date) {
    date = new Date(date);
  } else {
    date = new Date();
  }
  return new Date(date.setMonth(date.getMonth() + months)).toLocaleDateString('zh-TW');
}

export function AddMonthLessOneDay(months:number, date:string|Date|undefined = undefined){
  const d = new Date(AddMonth(months, date));
  console.log(d);
  return new Date(d.setDate(d.getDate()-1)).toLocaleDateString('zh-TW');
}

export function formatDateAddSlashes(date: string): string {
    if (date.length !== 8) {
        throw new Error('Date string must be in the format YYYYMMDD');
    }
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    return `${year}/${month}/${day}`;
}
/**
 * param Object checker , update shall have same porperty and value type
 * array will not check inside (if array must update whole array)
 * Param: Old value
 * Updater: new value
 */
export function SystemParamCheck(oldP:any, newP:any) {
  if (!isObject(newP)) return false;
  console.log('spc:', newP, oldP);
  return Object.keys(oldP).every((key) => {
    // console.log(key,'=> old:', oldP[key],'=> new:', newP[key]);
    if (!newP[key]) {
      console.log('key not found:', key);
      return false;
    }
    if (typeof(oldP[key]) !== typeof(newP[key])){
      console.log('type error:', typeof(oldP[key]), typeof(newP[key]));
      return false;
    } 
    // if (isObject(updater[key])) return SystemParamCheck(param[key], updater[key]);
    return true;
  });
}