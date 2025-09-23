//import AdmZip from 'adm-zip';
import { DateLocale } from '../../classes/common/date-locale';

import * as AWS from "aws-sdk";
import { promisify } from 'node:util';
import { getDbUri, getMongoDB } from './mongodb';
import * as path from 'node:path';

const AWS_S3_BUCKET = 'images.uuss.net/linkougolf_db';
const myDate = new DateLocale();
const dbFileName = 'linkougolf';
const exec = promisify(require('node:child_process').exec);
const s3bucket = new AWS.S3({
            region: 'ap-southeast-1',
        });


export const DumpToS3 = async ():Promise<void> => {
    //console.log(process.env);
    console.info(`mongodb back to ${AWS_S3_BUCKET} is starting at ${myDate.toDateTimeString()} `);

    process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];
    //const filename = dbFileName + '_' + myDate.DateStringWithoutSymbol();
    const folderName = `/tmp/`;
    let zipBuffer = null;

    const mongodb = await getMongoDB();
    const cols = mongodb.connection.db.listCollections();
    //cols.hasNext()

    const colNames = await cols.toArray();
    for(let i=0,n=colNames.length; i<n; i+=1) {
        const col = colNames[i];
        console.log('col:', col.name);
        const col_path =path.join(folderName, col.name);
        console.log('col_path:', col_path);

        const ans = await mongodb.model(col.name);
        console.log(col.name, ans);
    }
    // let mguri = getDbUri();
    // try {
    //     console.log('folderName:', folderName);
    //     //await exec(`mongodump -d goldmember -u ${process.env.MONGO_USER} -p ${process.env.MONGO_PASS} --out ${folderName}`);
    //     await exec(`mongodump --uri ${mguri} --out ${folderName}`);
    // } catch (err) {
    //     console.error('mongodump command failed', err);
    //     throw new Error('mongodump command failed');
    // }

    // try {
    //     const zip = new AdmZip();
    //     zip.addLocalFolder(folderName);
    //     zipBuffer = zip.toBuffer();
    // } catch (err) {
    //     console.error('archive creation failed:', err);
    //     throw new Error('archive creation failed');
    // }

    // try {
    //     await s3bucket.upload({
    //         Bucket: AWS_S3_BUCKET,
    //         Key: `${filename}.zip`,
    //         Body: zipBuffer,
    //         ContentType: 'application/zip',
    //         ServerSideEncryption: 'AES256',
    //         StorageClass: 'STANDARD',
    //     }).promise()
    // } catch (err) {
    //     console.error('upload to S3 failed: ', err)
    //     throw new Error('upload to S3 failed: ');
    // }

}