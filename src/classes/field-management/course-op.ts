import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { IbulkWriteItem, IReturnObj } from '../../dto/interface/common.if';
import { ICourse, ITee } from '../../dto/interface/field-management.if';
import { CoursesDocument } from '../../dto/schemas/courses.schema';
import { COURSE_COMBINE } from '../../utils/constant';
import { IUser } from '../../dto/interface/user.if';
import { DateLocale } from '../common/date-locale';

export class CourseOp {
    private myDate = new DateLocale();
    constructor(private readonly model:Model<CoursesDocument>){}
    // async list() {
    //     const rtn:IReturnObj = {};
    //     const data:ICourse[] = [];
    //     const ans = await this.model.find();
    //     console.log('COURSE_COMBINE:', COURSE_COMBINE);
    //     ans.forEach((cour:any) => {
    //         const itm = cour._doc;
    //         const tees:ITee[] = [];
    //         if (itm.blueTee) {
    //             tees.push({
    //                 tee: 'blueTee',
    //                 rating: itm.blueTee.rating,
    //                 slope: itm.blueTee.slope,
    //             });
    //         }
    //         if (itm.whiteTee) {
    //             tees.push({
    //                 tee: 'whiteTee',
    //                 rating: itm.whiteTee.rating,
    //                 slope: itm.whiteTee.slope,
    //             });             
    //         }
    //         if (itm.redTee) {
    //             tees.push({
    //                 tee: 'redTee',
    //                 rating: itm.redTee.rating,
    //                 slope: itm.redTee.slope,
    //             });                
    //         }
    //         // console.log(itm.courseIndex, COURSE_COMBINE[itm.courseIndex]);
    //         const tmp:ICourse = {
    //             courseIndex: itm.courseIndex,
    //             zone: COURSE_COMBINE[itm.courseIndex],
    //             tees,
    //         };
    //         data.push(tmp);
    //     });
    //     rtn.data = data;
    //     return rtn;
    // }
    async list() {
        const rtn:IReturnObj = {};
        //const data:ICourse[] = [];
        const ans = await this.model.find();
        //console.log('COURSE_COMBINE:', COURSE_COMBINE);
        rtn.data = ans;
        return rtn;
    }    
    async update(courseIndex:number, dta:Partial<ICourse>, user:Partial<IUser>) {
        const rtn:IReturnObj = {};
        const log = `操作人員:${user.username} 時間:${this.myDate.toDateTimeString()}`;
        const data:UpdateQuery<CoursesDocument> = dta;
        data.$push = { logs: log };
        const upd = await this.model.updateOne({courseIndex}, data, {upsert: true, strict: false});
        rtn.data =upd;
        return rtn;
    }
    async initData() {
        const del = await this.model.db.dropCollection('courses');
        const zones = defaultZones;
        const datas = zones.map((data, index) => {
            const tmp:ICourse = data as any;
            tmp.courseIndex = index;
            console.log('data all:', tmp);
            //console.log('data:', data, index);
            return tmp;
        });
        const rtn:IReturnObj = {};
        if (datas.length > 0) {
            console.log('datas:', datas);
            rtn.data = await this.model.insertMany(datas);
        }
        return rtn;
    }
}

const defaultZones =[ {
    zones: ['east', 'west'],
    tees: [
      { tee: 'blueTee', rating: 73.5, slope: 138 },
      { tee: 'whiteTee', rating: 71.5, slope: 134 },
      { tee: 'redTee', rating: 73.5, slope: 133 }
    ]
  },
  {
    zones: ['south', 'east'],
    tees: [
      { tee: 'blueTee', rating: 73.5, slope: 138 },
      { tee: 'whiteTee', rating: 71.7, slope: 134 },
      { tee: 'redTee', rating: 73.9, slope: 134 }
    ]
  },
  {
    zones: ['west', 'south'],
    tees: [
      { tee: 'blueTee', rating: 73.8, slope: 139 },
      { tee: 'whiteTee', rating: 71.9, slope: 135 },
      { tee: 'redTee', rating: 73.3, slope: 133 }
    ]
  }]