import { AWSError, Lambda } from "aws-sdk";
import { InvokeWithResponseStreamRequest } from "aws-sdk/clients/lambda";
const lambda = new Lambda({region: 'ap-southeast-1'});

export interface ISmsTarget {
    type: string;
    data: string;       // phone Number
}
export interface ISmsData {
    target: string;
    targetId: string;
    content: string;
}
const invokeLambda = (funcname:string, data:ISmsData) => {
    return new Promise((resolve, reject) => {
        const param: InvokeWithResponseStreamRequest = {
            FunctionName: funcname,
            InvocationType: 'RequestResponse',
            Payload: data ? JSON.stringify(data) : null,
        }
        lambda.invoke(param, (e:AWSError, data:Lambda.InvocationResponse) => {
            if (e) return reject(e);
            console.log('invokeLambda before json parse:', data.Payload);
            let payload = JSON.parse(data.Payload as string);
            console.log('invokeLambda', payload);
            if (payload.errcode && payload.errcode !== '0') return reject(payload)
            return resolve(payload)
        })
    })
}
export const verifyPhoneCode = (phone:string) => {
    if (phone.indexOf('+886') === 0) {
        if (phone.indexOf('+8860') === 0) phone = `+886${phone.substring(5)}`;
    } else if (phone.indexOf('0') == 0) {
        phone = `+886${phone.substring(1)}`;
    } else {
        phone = `+886${phone}`;
    }
    return phone;
}
export const sendSMSCode = (phone:string, msg:string) => {
    const target:ISmsTarget = {
        type: 'sms',
        data: phone,
    }
    return new Promise((resolve, reject) => {
        invokeLambda('union-lambda-prod-sendMsg', {
            target: target.type,
            targetId: target.data,
            content: msg,
        }).then((res:any) => {
            // console.log('sendSMSCode:', res);
            if(res.errcode !== '0') {
                return reject(res);
            }
            return resolve(res.data);
        }).catch((e) => {
            console.log("sendSMSCode Error:", e);
            return reject(e);
        })
    })
}