import axios from 'axios';
import { isArray } from 'class-validator';
import * as FormData from 'form-data';
let file_proxy = process.env.FILE_PROXY;
if (process.env.IS_OFFLINE) {
  file_proxy = process.env.FILE_PROXY_LOCAL;
}

export class FilesInspection {
    async verify(
      files:Express.Multer.File|Array<Express.Multer.File>, 
      // token:any
    ) {
      const formData = new FormData();
      let path = 'verify'
      if (isArray(files)) {
        path = 'verifies'
        files.forEach((file) => {
          formData.append('files', file.buffer as any, file.originalname);
        })        
      } else {
        formData.append('file', files.buffer as any, files.originalname);
      }
      const headers = formData.getHeaders();
      //headers.authorization = token;
      //headers['sitetype'] = 'manager';
      const url = `${file_proxy}/content-inspection/${path}`;
      console.log('url:', url);
      //console.log('headers:', headers);
      try {
        const res = await axios.post(
          url,
          formData,
          {
            headers,
          }
        )
        return res.data;
      } catch (error) {
        if (error.response  && error.response.data) {
          return error.response.data; 
        }
        console.error('file proxy error:', error);
        return error.message;
      }
        //return FuncWithTryCatchNew(this, 'verifyImg', file, text)
        //return FuncWithTryCatchNew(this, 'verify', file, text);
    }    
}