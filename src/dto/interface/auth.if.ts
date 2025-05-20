export interface IRefreshToken {
    refreshToken?: string;
    token?: string;
}

export interface ILoginResponse extends IRefreshToken {
    // token: string;
    totpIMG: string;
    deviceRefreshToken: string;
    //gaIMG?: string;
}

export interface ILogin {
    username: string;
    password: string;
    totpCode: string;
}

export interface ICaptchaData {
    captcha: string;
    captchaId: string;
}

export interface ILoginToken {
    uid: string;
    token: string;
    lastLoginId?: string; // user id Or member id
}