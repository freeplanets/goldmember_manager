import * as mongoose from 'mongoose';

let username = process.env.MONGO_USER;
let password = process.env.MONGO_PASS;
let resource = process.env.MONGO_HOST;
let dbase = process.env.MONGO_DB;
let port =process.env.MONGO_PORT;
let rpSet = process.env.MONGO_REPLICA_SET;
if (process.env.IS_OFFLINE) {
    username = process.env.LMONGO_USER;
    password = process.env.LMONGO_PASS;
    resource = process.env.LMONGO_HOST;
    dbase = process.env.LMONGO_DB;
    port =process.env.LMONGO_PORT;
    rpSet = process.env.LMONGO_REPLICA_SET;        
}
const encodePassword = encodeURIComponent(password);
console.log(`mongodb://${resource}:${port}/`, process.env)
export const MongodbProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        `mongodb://${resource}:${port}/`,
        {
          directConnection: true,
          replicaSet: rpSet,
          dbName: dbase,
          user: username,
          pass: encodePassword,
        },
      ),
  },
];
