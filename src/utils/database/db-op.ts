import mongoose from "mongoose";
import { getMongoDB } from "./mongodb";

export class dbInit {
    private dbase:mongoose.Mongoose;
    private async getDb() {
        this.dbase = await getMongoDB();
    }
    async getCollection() {
        if (!this.dbase)  await this.getDb();
        console.log('getCollection', this.dbase);
        const collectiions = await this.dbase.connection.db.listCollections().toArray();
        //collectiions.forEach((coll) => {
        for(let i=0,n=collectiions.length; i< n; i++) {
            const coll = collectiions[i];
            if (coll.name === 'ksmembers' || coll.name === 'users' 
                || coll.name === 'systemparameters' || coll.name === 'ksimportlogs') {
                console.log('keep:', coll.name);
            } else {
                await this.dropMyCollection(coll.name);
            }
        }
            // console.log(coll.name,'=>', coll.type, '=>', coll);

            // const tmp = 
        //});
    }
    async dropMyCollection(collectionName:string) {
        try {
            // Access the native MongoDB Db object
            //const db = mongoose.connection.db;
            const db = this.dbase.connection.db;

            // Drop the specified collection
            const result = await db.dropCollection(collectionName);
            console.log(`Collection '${collectionName}' dropped successfully:`, result);
        } catch (error) {
            if (error.code === 26) { // Code 26 indicates "Namespace not found" (collection doesn't exist)
            console.log(`Collection '${collectionName}' does not exist.`);
            } else {
            console.error(`Error dropping collection '${collectionName}':`, error);
            }
        }
    }  
}