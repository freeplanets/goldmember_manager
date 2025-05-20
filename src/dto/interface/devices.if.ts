export interface ILoginDevice {
    deviceType:string; // ios/android/web
    deivceBrand:string; //
    deviceModel:string; //,
    deviceName: string;
    deviceId:string;  //,
    systemName:string;  //,
    systemVersion:string;
    lastLogin: number;
    lastLoginIp?: string;    
}