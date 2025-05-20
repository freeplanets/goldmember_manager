import mongoose from "mongoose";

export const getDbUri = ():string => {
    let username = process.env.MONGO_USER;
    let password = process.env.MONGO_PASS;
    let resource = process.env.MONGO_HOST;
    let port =process.env.MONGO_PORT;
    let rpSet = process.env.MONGO_REPLICA_SET;
    if (process.env.IS_OFFLINE) {
        username = process.env.LMONGO_USER;
        password = process.env.LMONGO_PASS;
        resource = process.env.LMONGO_HOST;
        port =process.env.LMONGO_PORT;
        rpSet = process.env.LMONGO_REPLICA_SET;
    }
    const encodePassword = encodeURIComponent(password);
    console.log('getDbUri:', username, password, resource, port, rpSet);
    return `mongodb://${username}:${encodePassword}@${resource}:${port}/?retryWrites=true&w=majority&replicaSet=${rpSet}`;
}
export const getMongoDB = async ():Promise<mongoose.Mongoose> => {
    const uri = getDbUri();
    let dbase = process.env.MONGO_DB;
    if (process.env.IS_OFFLINE) dbase = process.env.LMONGO_DB;
    const opt:mongoose.ConnectOptions = {
        dbName: dbase,
        directConnection: true,
        connectTimeoutMS: 5000,
    }
    return mongoose.connect(uri, opt);
}