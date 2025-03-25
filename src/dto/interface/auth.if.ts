export interface IRefreshToken {
    refreshToken?: string;
}

export interface ILoginResponse extends IRefreshToken {
    token: string;
    gaIMG?: string;
}

export interface ILogin {
    username: string;
    password: string;
    totpCode: string;
}
