import { COURSES_CODE, FAIRWAY_PATH } from '../../utils/enum';
import { IModifiedBy } from './modifyed-by.if';

export interface IGreenSpeeds {
    id: string; //gs_20250115_001,
    date: string;   //2025/01/15,
    westSpeed: number;  //10.5,
    southSpeed: number; //11.2,
    eastSpeed: number;  //9.8,
    notes: string;  //今日天氣良好，果嶺狀況佳,
    recordedBy: string; //場務主管,
    recordedAt: string; //2025-01-15T08:30:00Z
    recordedAtTS: number; //時間戳 
    logs: string[];
}

export interface IFairway {
    // id: string;
    path: FAIRWAY_PATH;
    fairway: number;    //1,
    blueTee: number;    //545,
    whiteTee: number;   //526,
    redTee: number; //490,
    par: number;    //5,
    hdp: number;    //8
    logs: string[];    
}

export interface IIrrigationDecisions {
    id: string;
    date: string; //2025/01/15,
    greenId: string;  //W01A,
    rain24h: number;  //5.2,
    tmax: number; //28.5,
    windSpeed: number;    //3.2,
    et0: number;  //4.2,
    sm5cm: number;    //22.5,
    sm12cm: number;   //35.8,
    sm20cm: number;   //42.1,
    decisionAM: number;
    decisionPM: number;
    mode: string;
    comments: string; //根層偏乾，建議中度灌溉
    recordedBy: string; //場務主管,
    recordedAt: string; //2025-01-15T08:30:00Z
    recordedAtTS: number;
    logs: string[];
}

export interface ITeeInfo {
    rating: number; //73.5,
    slope: number;  //138    
}

export interface ITee {
    tee: string,
    rating: number,
    slope: number,    
}

export interface ICourse {
    courseIndex: number;
    zones: string[];
    tees: ITee[];
    logs: string[];
}

export interface ICourseOld {
    courseIndex: COURSES_CODE;
    blueTee: ITeeInfo;
    whiteTee: ITeeInfo;
    redTee: ITeeInfo;
    logs:string[],
}