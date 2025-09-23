import { DATE_STYLE } from '../../utils/constant';

interface ITimeSetting {
  locale: Intl.LocalesArgument;
  options: Intl.DateTimeFormatOptions;
}

export const TIME_SETTING:ITimeSetting = {
  locale: 'zh-TW',
  options: {
    hourCycle: 'h23',
    timeZone: 'Asia/Taipei',
  }
}

export class DateLocale  {
    private locale = TIME_SETTING.locale;
    private options:Intl.DateTimeFormatOptions;
    private dateOptions:Intl.DateTimeFormatOptions;
    private dateTimeOptions:Intl.DateTimeFormatOptions;
    constructor() {
        this.options = TIME_SETTING.options;
        this.dateOptions = { ...this.options };
        this.dateOptions.year = 'numeric';
        this.dateOptions.month = '2-digit';
        this.dateOptions.day = '2-digit';
        this.dateTimeOptions = { ...this.dateOptions }
        this.dateTimeOptions.hour = '2-digit';
        this.dateTimeOptions.minute = '2-digit';
        this.dateTimeOptions.second = '2-digit';
    }
    toDateString(date:string | number | Date | undefined = '', splitStyle = '') {
        // if (!date) 
        if (date && typeof date === 'string') {
            // console.log('DateLocale toDateString check0:');
            let mySplitStyle:string;
            if (date.indexOf('/') !== -1 ) mySplitStyle = '/';
            if (date.indexOf('-') !== -1 ) mySplitStyle = '-';
            if (!mySplitStyle) {
                if (!splitStyle) splitStyle = '/';
                return this.formatDateAddSlashes(date, splitStyle);
            } else {
                const [ year,  month,  day] = date.split(mySplitStyle);
                if (!splitStyle) splitStyle = mySplitStyle;
                console.log(year, month, day, splitStyle)
                return `${year}${splitStyle}${month.padStart(2, '0')}${splitStyle}${day.padStart(2, '0')}`;
            }
        } else {
            //console.log('DateLocale toDateString check1:');
            let d:Date;
            if (date) {
                d = new Date(date);
            } else {
                d = new Date();
            }
            return d.toLocaleDateString(this.locale, this.dateOptions);
        }

    }
    toTimeString(date:string | number | undefined = '') {
        if (!date) return new Date().toLocaleTimeString(this.locale, this.dateTimeOptions);
        return new Date(date).toLocaleTimeString(this.locale, this.dateTimeOptions);
    }
    toDateTimeString(date:string | number | undefined = '') {
        if (!date) return new Date().toLocaleString(this.locale, this.dateTimeOptions);
        return new Date(date).toLocaleString(this.locale, this.dateTimeOptions);
    }
    getMonth(date:string | number | undefined = ''):number {
        const monthOptions = { ...this.options };
        monthOptions.month = 'numeric';
        let d:Date;
        if (date) d = new Date(date);
        else d = new Date();
        const month = d.toLocaleDateString(this.locale, monthOptions);
        return parseInt(month);
    }
    getYear(date:string | number | undefined = ''):number {
        const yearOptions = { ...this.options };
        yearOptions.year = 'numeric';
        let d:Date;
        if (date) d = new Date(date);
        else d = new Date();
        const year = d.toLocaleDateString(this.locale, yearOptions);
        return parseInt(year);        
    }
    getYearMonth(date:string | number | undefined = ''): {year:number, month:number} {
        const year = this.getYear(date);
        const month = this.getMonth(date);
        return { year, month };
    }
    getBirthMonth(birthday:string) {
        if (!birthday) return 0;
        let spt = '/';
        if (birthday.indexOf(spt) == -1) spt = '-';
        const pos1 = birthday.indexOf(spt);
        const pos2 = birthday.indexOf(spt, pos1+1)
        if (pos1 ==-1 || pos2 ==-1) return 0;
        let newStr = birthday.substring(pos1+1, pos2);
        return Number(newStr);
    }
    AddMonth(months:number, date:string|Date|undefined = undefined){
        if (date) {
            date = new Date(date);
        } else {
            date = new Date();
        }
        const d = new Date(date.setMonth(date.getMonth() + months));
        return this.toDateString(d);
    }
    AddMonthLessOneDay(months:number, date:string|Date|undefined = undefined){
        const d = new Date(this.AddMonth(months, date));
        console.log(d);
        //return new Date(d.setDate(d.getDate()-1)).toLocaleDateString('zh-TW');
        return this.toDateString(new Date(d.setDate(d.getDate() -1)));
    }
    AddDate(date:string|Date|undefined = undefined, day:number=1) {
        if (date) {
            date = new Date(date);
        } else {
            date = new Date();
        }
        const d = new Date(date.setDate(date.getDate() + day));
        return this.toDateString(d);        
    }
    private formatDateAddSlashes(date: string, splitStyle = ''): string {
        if (date.length !== 8) {
            throw new Error('Date string must be in the format YYYYMMDD');
        }
        const year = date.substring(0, 4);
        const month = date.substring(4, 6);
        const day = date.substring(6, 8);
        if (!splitStyle) splitStyle = '/';
        return `${year}${splitStyle}${month}${splitStyle}${day}`;
    }
    toTS(date:string='') {
        const d = new Date();
        let diff = d.getHours() === d.getUTCHours() ? -8 : 0;
        let year= d.getUTCFullYear();
        let month= d.getUTCMonth();
        let day= d.getUTCDate();
        if (date && DATE_STYLE.test(date)) {
            [year, month, day] = date.split('/').map((dd)=> parseInt(dd));
            month = month - 1;
        }
        const ts = new Date(year, month, day, diff, 0, 0).getTime();
        console.log(date, year, month, day, d.getHours(), d.getUTCHours(), diff, d.getTime(), ts);
        return ts;
    }

    DateStringWithoutSymbol() {
        return this.toDateString().replaceAll('/','');
    }
}