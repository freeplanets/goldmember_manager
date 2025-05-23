import axios, { AxiosRequestConfig } from "axios";

export interface IParamForGoogleAuth {
  AppName: string;         // program name
  AppInfo: string;         // user name
  SecretCode: string;     // 12345678BXYT
}
export interface IGAValidate {
  Pin: string;
  SecretCode: string;
}

export default class GoogleAuth {
  get SecretCode(): string {
    const str: string[] = [];
    while (str.length < 12) {
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
    const min = 48;
    const max = 90;
    let rnd = 0;
    do {
      rnd = this.myRandom(min, max);
    } while (rnd > 57 && rnd < 65);
    return rnd;
  }
  private PAIR_URL = "https://www.authenticatorApi.com/pair.aspx";
  private VALID_URL = "https://www.authenticatorApi.com/Validate.aspx"; // ?Pin=123456&SecretCode=12345678BXYT
  // private Optons: https.RequestOptions = {
  //   headers: {Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"}
  // };
  private axConfig:AxiosRequestConfig = {
    headers: {Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"}    
  }
  // private curData: IParamForGoogleAuth|undefined;
  public async getIMG(pfga: IParamForGoogleAuth): Promise<string|undefined> {
    const sparam = this.rgParam(pfga);
    // const url: string = `${this.pair_url}?${param.join("&")}`;
    const url: string = `${this.PAIR_URL}?${sparam}`;
    return new Promise((resolve) => {
      // console.log("getIMG check1");
      // https.request()
      axios.get(url, this.axConfig).then((res) => {
        // console.log("getIMG check2", res);
        resolve(res.data);
      }).catch((e) => {
          console.log("Error is raised by SendMsg:", e);
          resolve(undefined);        
      })

    });
  }
  public async Validate(gav: IGAValidate) {
    const sparam = this.rgParam(gav);
    // const url: string = `${this.pair_url}?${param.join("&")}`;
    const url: string = `${this.VALID_URL}?${sparam}`;
    // console.log("Validate", url);
    return new Promise((resolve) => {
      axios.get(url, this.axConfig).then((res) => {
        resolve(res.data);
      }).catch((e) => {
        console.log("Error is raised by SendMsg:", e);
        resolve(undefined);        
      })

    });
  }
  public myRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  private rgParam(kv: any): string {
    const param: string[] = [];
    Object.keys(kv).map((key) => {
      param.push(`${key}=${kv[key]}`);
    });
    return param.join("&");
  }
}
