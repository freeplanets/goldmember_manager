import { Injectable } from '@nestjs/common';
import { GreenSpeeds, GreenSpeedsDocument } from '../dto/schemas/green-speeds.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { GreenSpeedsOp } from '../classes/field-management/green-speeds-op';
import { DateRangeQueryReqDto } from '../dto/common/date-range-query-request.dto';
import { FuncWithTryCatchNew } from '../classes/common/func.def';
import { ICourse, IFairway, IGreenSpeeds, IIrrigationDecisions } from '../dto/interface/field-management.if';
import { IUser } from '../dto/interface/user.if';
import { DateLocale } from '../classes/common/date-locale';
import { FairwayOp } from '../classes/field-management/fairway-op';
import { Fairway, FairwayDocument } from '../dto/schemas/fairway.schema';
import { Courses, CoursesDocument } from '../dto/schemas/courses.schema';
import { CourseOp } from '../classes/field-management/course-op';
import { IrrigationDecisionOp } from '../classes/field-management/irrigation-decision.op';
import { IrrigationDecisions, IrrigationDecisionsDocument } from '../dto/schemas/irrigation-decisions.schema';

@Injectable()
export class FieldManagementService {
    private myDate = new DateLocale();
    private gsOP:GreenSpeedsOp;
    private fdOP:FairwayOp;
    private courseOP:CourseOp;
    private irrDec:IrrigationDecisionOp;
    constructor(
        @InjectModel(GreenSpeeds.name) private readonly modelGS:Model<GreenSpeedsDocument>,
        @InjectModel(Fairway.name) private readonly modelFD:Model<FairwayDocument>,
        @InjectModel(Courses.name) private readonly modelCourses:Model<CoursesDocument>,
        @InjectModel(IrrigationDecisions.name) private readonly modelIrrDec:Model<IrrigationDecisionsDocument>,
    ){
        this.gsOP = new GreenSpeedsOp(modelGS);
        this.fdOP = new FairwayOp(modelFD);
        this.courseOP = new CourseOp(modelCourses);
        this.irrDec = new IrrigationDecisionOp(modelIrrDec);
    }
    async getGreenSpeeds(dates:DateRangeQueryReqDto) {
        return FuncWithTryCatchNew(this.gsOP, 'list', dates.startDate, dates.endDate);
    }
    async createGreenSpeeds(data:Partial<IGreenSpeeds>, user:Partial<IUser>) {
        data.recordedAt = this.myDate.toDateTimeString();
        data.recordedBy = user.username;
        data.recordedAtTS = Date.now();
        data.logs = [`新增人員:${data.recordedBy} 時間：${data.recordedAt }`]
        return FuncWithTryCatchNew(this.gsOP, 'add', data);
    }
    async updateGreenSpeeds(id:string, dta:Partial<IGreenSpeeds>, user:Partial<IUser>) {
        const data:UpdateQuery<GreenSpeedsDocument> = dta;
        data.recordedAt = this.myDate.toDateTimeString();
        data.recordedBy = user.username;
        data.recordedAtTS = Date.now();
        data.$push = { logs: `修改人員:${data.recordedBy} 時間：${data.recordedAt }`};
        return FuncWithTryCatchNew(this.gsOP, 'update', id, data);
    }
    async getFairwayData() {
        return FuncWithTryCatchNew(this.fdOP, 'list');
    }

    async modifyFairwayData(course:string, fairway:number, data:Partial<IFairway>,user:Partial<IUser>) {
        return FuncWithTryCatchNew(this.fdOP, 'update', course, fairway, data, user);
    }
    async getCourses() {
        return FuncWithTryCatchNew(this.courseOP, 'list');
    }
    async modifyCourses(courseIndex:number, data:Partial<ICourse>, user:Partial<IUser>) {
        return FuncWithTryCatchNew(this.courseOP, 'update', courseIndex, data, user);
    }
    async getIrrigationDecisions(dates:DateRangeQueryReqDto) {
        return FuncWithTryCatchNew(this.irrDec, 'list', dates.startDate, dates.endDate);
    }
    async addIrrigationDecision(data:Partial<IIrrigationDecisions>, user:Partial<IUser>) {
        return FuncWithTryCatchNew(this.irrDec, 'add', data, user);
    }
    async updateIrrigationDecision(id:string, data:Partial<IIrrigationDecisions>, user:Partial<IUser>) {
        return FuncWithTryCatchNew(this.irrDec, 'modify', id, data, user);
    }
    async initCourseData() {
        return FuncWithTryCatchNew(this.courseOP, 'initData');
    }
    async initFairwayData() {
        return FuncWithTryCatchNew(this.fdOP, 'initData');
    }
}