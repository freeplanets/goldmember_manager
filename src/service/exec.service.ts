import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KsMember, KsMemberDocument } from '../dto/schemas/ksmember.schema';

@Injectable()
export class ExecService {
    constructor(@InjectModel(KsMember.name) private readonly modelKs:Model<KsMemberDocument>){}

    async getKsMember() {
        return this.modelKs.find().sort({no: 1});
    }
}