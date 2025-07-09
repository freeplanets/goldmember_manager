import * as AWS from "aws-sdk";
import { Readable } from "stream";
import { v1 as uuidv1 } from 'uuid';

export interface Upload2S3Response {
    fileUrl: string;
    OriginalFilename: string;
    filesize?: number;
}    

export class Upload2S3 {
    private AWS_S3_BUCKET = 'images.uuss.net/linkougolf';
    private s3:AWS.S3;
    private filename:string;
    private newfilename:string;
    private filesize:number;
    //  = new AWS.S3({
    //   region: 'ap-southeast-1',
    // });
    constructor(region: string = 'ap-southeast-1') {
        this.s3 = new AWS.S3({
            region: region,
        });
    }

    get file_url() {
        return `https://${this.AWS_S3_BUCKET}/${this.newfilename}`;
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
    async uploadFile(file:Express.Multer.File) {
        console.log('file:', file);
        const { originalname } = file;
        this.filename = originalname;
        const ary = originalname.split('.');
        this.newfilename = `${uuidv1()}.${ary[ary.length-1]}`;
        file.originalname = this.newfilename;
        this.filesize = file.size;
        return await this.s3_upload(
            file.buffer,
            this.AWS_S3_BUCKET,
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
}