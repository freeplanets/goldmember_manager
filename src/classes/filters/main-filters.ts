import { FilterQuery } from 'mongoose';
import { MEMBER_EXTEND_GROUP, MEMBER_GROUP, MEMBER_LEVEL } from '../../utils/enum';
import { IMember } from '../../dto/interface/member.if';
import { IHasFilterItem, IHasId } from '../../dto/interface/common.if';
import { KS_MEMBER_STYLE_FOR_SEARCH } from '../../utils/constant';
import { KsMemberDocument } from '../../dto/schemas/ksmember.schema';
import { DateLocale } from '../common/date-locale';

export class MainFilters {
  private myDate = new DateLocale();
  baseDocFilter<D extends IHasFilterItem, I>(targetGroups:MEMBER_GROUP[], type:string|undefined = undefined, extendFilter:MEMBER_EXTEND_GROUP[]|undefined = undefined) {
    let filters:FilterQuery<D>={};
    let objHasIds:IHasId[] = []
    if (targetGroups) {
      const tmpF = {
        $or: [],
      }        
      targetGroups.forEach((itm:any) => {
        console.log('targetGroups type:', typeof itm, itm);
        let tmp:FilterQuery<I>;
        if (typeof itm === 'object') {
          //objHasIds.push(itm);
          tmp = {
            targetGroups: { $elemMatch: {id: itm.id }}          
          }
        } else {
          tmp = {
            targetGroups: { $elemMatch: { $eq: itm }}
          }
        }
        tmpF.$or.push(tmp);
      });

      if (tmpF.$or.length > 1) {
        filters = {
          $or: tmpF.$or,
        }
      } else {
        if (tmpF.$or[0]) filters = tmpF.$or[0];
      }
    }
    if (extendFilter && extendFilter[0] === MEMBER_EXTEND_GROUP.BIRTH_OF_MONTH) {
      filters = {
        extendFilter: extendFilter,
        birthMonth: new Date().getMonth() + 1,
      }
    }
    if (type){
      //if (!filters) filters = {};
      //if (type !== 'pending') {
        filters.type = type;
      //}
    }
    return filters;      
  }
  membersFilter(targetGroups:MEMBER_GROUP[], extendFilter:MEMBER_EXTEND_GROUP[]|undefined = undefined) {
      let filter:FilterQuery<IMember> = {}
      let gName = '';
      const mbrs:IHasId[] = [];
      targetGroups.forEach((group) => {
        if (typeof group === 'object') {
          mbrs.push(group);
        } else {
          switch(group) {
            case MEMBER_GROUP.ALL:
              break;
            case MEMBER_GROUP.GENERAL_MEMBER:
              gName = MEMBER_LEVEL.GENERAL_MEMBER;
            case MEMBER_GROUP.SHARE_HOLDER:
              if (gName === '') gName = MEMBER_LEVEL.SHARE_HOLDER; 
            case MEMBER_GROUP.DEPENDENTS:
              if (gName === '') gName = MEMBER_LEVEL.DEPENDENTS;
              if (!filter.membershipType) {
                filter.membershipType = gName;
              } else if (typeof(filter.membershipType)==='object') {
                filter.membershipType.push(gName);
              } else {
                filter.membershipType = [filter.membershipType , gName];
              }
              gName = '';
              break;
            case MEMBER_GROUP.DIRECTOR_SUPERVISOR:
              //filter.isDirector = { $ne: DS_LEVEL.NONE };
              filter.isDirector = true
              break;
          }
        }
      });
      if (filter.membershipType && filter.isDirector) {
          filter = {
              $or: [
                  { membershipType: filter.membershipType },
                  { isDirector: filter.isDirector },
              ],
          };
      }
      if (mbrs.length > 0) {
        const ids:string[] = [];
        mbrs.forEach((obj) => {
          if (!KS_MEMBER_STYLE_FOR_SEARCH.test(obj.id)) {
            ids.push(obj.id);
          }
        });
        if (ids.length > 0) {
          if (filter.$or) {
            filter.$or.push({
              id: { $in: ids }
            })
          } else {
            filter.id = { $in: ids };
          }
        }
      }
      if (extendFilter && extendFilter[0] === MEMBER_EXTEND_GROUP.BIRTH_OF_MONTH ) {
        //filter.birthMonth = { $in: extendFilter };
        filter.birthMonth = new Date().getMonth() + 1;
      }
      console.log('filter:', filter);
      return filter;
  }
  KsMemberFilter(targetGroups:MEMBER_GROUP[], extendFilter:MEMBER_EXTEND_GROUP[]|undefined = undefined) {
    // console.log('KsMemberFilter:', targetGroups, extendFilter);
    let filter:FilterQuery<KsMemberDocument> = {};
    let shareholder = false;
    let dependents = false;
    let mbrs:IHasId[] = [];
    targetGroups.forEach((g) => {
      console.log('g:', g, typeof g);
      if (typeof g === 'object') {
        mbrs.push(g);
      } else {
        if (g === MEMBER_GROUP.ALL || g === MEMBER_GROUP.SHARE_HOLDER) shareholder = true;
        if (g === MEMBER_GROUP.ALL || g === MEMBER_GROUP.DEPENDENTS) dependents = true;
      }
    });
    // console.log('chk:', shareholder, dependents);
    if (shareholder) {
      filter.$or = [
        { 
            $and: [
                { no: { $regex: /^1\d{3}$/ } },
                { no: { $lt: '1827' }},
            ]
        },
        {
            $and: [
                { no: { $regex: /^2\d{3}$/ }},
                { no: { $lt: '2175'}},
            ]
        }
      ]
    }
    if (dependents) {
      if (filter.$or) {
        filter.$or.push({ no: { $regex: /^[56]\d{3}$/ }});
      } else {
        filter.no = {};
        filter.no.$regex = /^[56]\d{3}$/;          
      }
    }
    // console.log('check1:', filter.$or);
    if (shareholder || dependents) {
      filter.appUser = { $eq: '' };
      if (extendFilter && extendFilter[0] === MEMBER_EXTEND_GROUP.BIRTH_OF_MONTH) {
            const month = this.myDate.getMonth();
            filter.birthMonth = month
      }
    }
    if (mbrs.length > 0) {
      const nos:string[] = [];
      mbrs.forEach((obj) => {
        if (KS_MEMBER_STYLE_FOR_SEARCH.test(obj.id)) {
          nos.push(obj.id);
        }
      });
      console.log('nos:', nos);
      if (nos.length > 0) {
        if (filter.$or) {
          filter.$or.push({
            no: { $in: nos }
          })
        } else if (filter.no) {
          filter.$or = [
            {no: filter.no },
            {no: {$in: nos}}
          ]
        } else {
          filter.no = { $in: nos },
          filter.$or = [
            { appUser: {$exists: false }},
            { appUser: ''},     
          ]
        }
      }
    }
    // console.log("getMember ks filter:", filter, filter.$or, filter.appUser);
    return filter;
  }    
}