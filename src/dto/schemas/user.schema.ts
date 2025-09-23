import { Prop, PropOptions, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IUser } from "../interface/user.if";
import { Document } from "mongoose";
import { LEVEL } from "../../utils/enum";
import * as bcrypt from "bcryptjs";
import { ILoginDevice } from "../interface/devices.if";
import { LoginDevice } from "../devices/login-device";

export type UserDocument = Document & User;

@Schema()
export class User implements IUser {
    @Prop({required: true, index: true, unique: true})
    id: string;

    @Prop({unique: true, required: true})
    username: string;

    @Prop({unique: true})
    displayName: string;

    @Prop({
        
    })
    password: string;

    @Prop()
    role: string;

    @Prop({enum: LEVEL})
    authRole: LEVEL;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop({
        default: false,
    })
    isActive: boolean;

    @Prop({
        default: false,
    })
    isLocked: boolean;

    @Prop({
        default: 0,
    })
    passwordFailedCount: number;

    @Prop()
    lastLogin: number;

    @Prop()
    lastLoginIp: string;

    @Prop({
        type: LoginDevice,
    })
    lastLoginDevice: Partial<ILoginDevice>;

    @Prop()
    has2Fa: boolean;
    
    @Prop({
        default: true,
    })
    need2changePass: boolean;

    @Prop()
    SecretCode: string;

    @Prop({
        default: 0,
    })
    passwordLastTryTs: number;

    @Prop({
      type:Array<LoginDevice>  
    })
    devices: Partial<ILoginDevice>[];
}
const saltRounds = Number(process.env.SALT_ROUNDS);
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre("save", async function name(next:Function) {
    // console.log('do pre save!!');
    // var user = this;
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (e) {
        return next(e);
    }
});

UserSchema.pre("findOneAndUpdate", async function name(next:Function) {
    const upd = this.getUpdate() as Partial<IUser>;
    // console.log("pre findOneAndUpdate", this.getUpdate());
    if (upd.password) {
        const salt = await bcrypt.genSalt(saltRounds);
        upd.password = await bcrypt.hash(upd.password, salt);
        //this.setUpdate(upd);
    }
    // console.log("pre findOneAndUpdate", this.getUpdate());
    return next();
})
UserSchema.pre("updateOne", async function name(next:Function) {
    //console.log("updateOne start");
    const upd = this.getUpdate() as Partial<IUser>;
    //console.log("pre UpdateOne", upd);
    if (upd.password) {
        const salt = await bcrypt.genSalt(saltRounds);
        upd.password = await bcrypt.hash(upd.password, salt);
        //this.setUpdate(upd);
    }
    //console.log("pre UpdateOne end");
    return next();    
})
UserSchema.methods.comparePassword = async function(candidatePassword:string, salt:string) {
    // console.log('comparePassword', candidatePassword, salt);
    return bcrypt.compare(candidatePassword, salt);
}
