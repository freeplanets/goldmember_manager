import * as AWS from "aws-sdk";
import { Readable } from "stream";
import { v1 as uuidv1 } from 'uuid';
//import { needsBuffer } from "./constant";

export interface Upload2S3Response {
    fileUrl: string;
    OriginalFilename: string;
    filesize?: number;
}



export class Upload2S3 {
    private AWS_S3_BUCKET = 'images.uuss.net';
    private prefix = '/linkougolf';
    private s3:AWS.S3;
    private filename:string;
    private newfilename:string;
    private filesize:number;
    private changeFileName = true;

    constructor(region: string = 'ap-southeast-1', bucket='') {
        this.s3 = new AWS.S3({
            region,
        });
        if (bucket) {
            this.AWS_S3_BUCKET = bucket;
        }
    }
    get file_url() {
        return `https://${this.AWS_S3_BUCKET}${this.prefix}/${this.newfilename}`;
    }
    get originalFilename() {
        return this.filename;
    }
    get Response():Upload2S3Response {
        return {
            fileUrl: this.file_url,
            OriginalFilename: this.originalFilename,
            filesize: this.filesize,   
        }
    }

    /**
     * Uploads a file to S3 and returns the response.
     * @param file - The file to upload.
     * @returns The S3 upload response or false if an error occurs.
     */
    async uploadFile(file:Express.Multer.File, changeFileName = true) {
        console.log('uploadFile:', file);
        //if (needsBuffer(file.originalname)) {
        const { originalname } = file;
        this.filename = originalname;
        if (changeFileName) {
            const ary = originalname.split('.');
            this.newfilename = `${uuidv1()}.${ary[ary.length-1]}`;
            file.originalname = this.newfilename;
        } else {
            this.newfilename = file.originalname;
        }
        this.filesize = file.size;
        return await this.s3_upload(
            file.buffer,
            `${this.AWS_S3_BUCKET}${this.prefix}`,
            file.originalname,
            file.mimetype
        );
    }
    
    private async s3_upload(fileBuffer:Buffer|Uint8Array|Blob|string|Readable, bucket:string, name:string, mimetype:string) {
        const params:AWS.S3.PutObjectRequest = {
            Bucket: bucket,
            Key: String(name),
            Body: fileBuffer,
            // ACL: 'public-read',
            ContentType: mimetype,
            ContentDisposition: 'inline',
        };
        try {
            const s3Response = await this.s3.upload(params).promise();
            return s3Response;
        } catch(err) {
            console.log("S3 Upload Error:", err);
            return false;
        }
    }
    async delFile(fileUrl:string) {
        const key = this.getKey(fileUrl);
        if (!key) return false;
        console.log('delFile key:', key);
        const params:AWS.S3.Types.DeleteObjectRequest = {
            Bucket: this.AWS_S3_BUCKET+this.prefix,
            Key: key,
        }
        try {
            const ans = await this.s3.deleteObject(params).promise();
            console.log('S3 delete file ans:', ans);
            return true;
        } catch (error) {
            console.log('S3 delete file error:', error);
            return false;
        }
    }
    private getKey(url:string) {
        const pos = url.indexOf('linkougolf/');
        if (pos === -1) return '';
        //return url.slice(pos, url.length);
        return url.slice(pos+11, url.length);
    }
}