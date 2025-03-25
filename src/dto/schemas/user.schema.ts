import { Prop, PropOptions, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IUser } from "../interface/user.if";
import { Document } from "mongoose";
import { LEVEL } from "../../utils/enum";
import * as bcrypt from "bcryptjs";

export type UserDocument = Document & User;

@Schema()
export class User implements IUser {
    @Prop({required: true, index: true, unique: true})
    id: string;

    @Prop({unique: true})
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

    @Prop()
    isActive: boolean;

    @Prop()
    lastLogin: string;

    @Prop()
    lastLoginIp: string;

    @Prop()
    has2Fa: boolean;
    
    @Prop({
        default: true,
    })
    need2changePass: boolean;

    @Prop()
    SecretCode: string;
}
const saltRounds = 10;
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre("save", async function name(next:Function) {
    // console.log('do pre save!!');
    // var user = this;
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
        // bcrypt.genSalt(saltRounds, function(err, salt) {
        //     if (err) return next(err);
        //     bcrypt.hash(user.password, salt, function(err, hash) {
        //         if (err) return next(err);
        //         console.log("password", hash);
        //         user.password = hash;
        //         next();
        //     })
        // });
    } catch (err) {
        return next(err);
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
UserSchema.methods.comparePassword = async function(candidatePassword:string, salt:string) {
    // console.log('comparePassword', candidatePassword, salt);
    return bcrypt.compare(candidatePassword, salt);
}