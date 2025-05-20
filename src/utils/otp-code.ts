import { authenticator, totp } from "otplib";
import * as qrcode from "qrcode";

declare type SecretKey = string;

interface VerifyOptions {
    token: string;
    secret: SecretKey;
}

export class OtpCode {
    private opt = {
        opoch: Date.now(),
        step: 30,
        window: 1, 
    }
    getTotpCode(secret:string, appName:string, username:string) {
        authenticator.options = this.opt;
        const keyuri = authenticator.keyuri(
            encodeURIComponent(username), 
            encodeURIComponent(appName), 
            secret,
        );
        return keyuri;
    }
    async getImg(secret:string, appName:string, username:string) {
        const otpauth = this.getTotpCode(secret, appName, username);
        return qrcode.toDataURL(otpauth);
    }
    getToken(secret:string):string {
        authenticator.options = {step: 60};
        // console.log('getToken', authenticator.allOptions());
        return authenticator.generate(secret);
    }
    verify(totpCode:string, secret:string):boolean {
        let isVerify = false;
        // console.log(typeof(totpCode), typeof(secret), totpCode, secret);
        const opts:VerifyOptions = {
            token: totpCode,
            secret: secret,
        }
        authenticator.options = this.opt;
        isVerify =  authenticator.verify(opts);
        return isVerify;
    }
    get SecretCode(): string {
        const str: string[] = [];
        while (str.length < 17) {
          const s = String.fromCharCode(this.Random);
          if (str.indexOf(s) < 0) {
            str.push(s);
          }
        }
        return str.join("");
    }
    get Random() {
        // 48-57 => 0-9
        // 65-90 => A-Z
        const min = 65;
        const max = 90;
        let rnd = 0;
        do {
            rnd = this.myRandom(min, max);
        } while (rnd > 57 && rnd < 65);
        return rnd;
    }
    public myRandom(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}