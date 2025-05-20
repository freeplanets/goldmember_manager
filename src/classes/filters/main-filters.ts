import { FilterQuery } from 'mongoose';
import { DS_LEVEL, MEMBER_EXTEND_GROUP, MEMBER_GROUP, MEMBER_LEVEL } from '../../utils/enum';
import { IMember } from '../../dto/interface/member.if';
import { IHasFilterItem } from '../../dto/interface/common.if';

export class MainFilters {
    baseDocFilter<D extends IHasFilterItem, I>(targetGroups:MEMBER_GROUP[], type:string|undefined = undefined, extendFilter:MEMBER_EXTEND_GROUP[]|undefined = undefined) {
      let filters:FilterQuery<D>;
      if (targetGroups) {
        const tmpF = {
          $or: [],
        }        
        targetGroups.forEach((itm) => {
            const tmp:FilterQuery<I>= {
              targetGroups: { $elemMatch: {$eq: itm }}
            }
            tmpF.$or.push(tmp);
        });

        if (tmpF.$or.length > 1) {
          filters = {
            $or: tmpF.$or,
          }
        } else {
          filters = tmpF.$or[0];
        }
      }
      if (extendFilter && extendFilter[0] === MEMBER_EXTEND_GROUP.BIRTH_OF_MONTH) {
        filters = {
          extendFilter: extendFilter,
          birthMonth: new Date().getMonth() + 1,
        }
      }
      if (type){
        if (!filters) filters = {};
        filters.type = type;
      }
      return filters;      
    }
    membersFilter(targetGroups:MEMBER_GROUP[], extendFilter:MEMBER_EXTEND_GROUP[]|undefined = undefined) {
        let filter:FilterQuery<IMember> = {}
        let gName = '';
        targetGroups.forEach((group) => {
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
        });
        if (filter.membershipType && filter.isDirector) {
            filter = {
                $or: [
                    { membershipType: filter.membershipType },
                    { isDirector: filter.isDirector },
                ],
            };
        }
        if (extendFilter && extendFilter[0] === MEMBER_EXTEND_GROUP.BIRTH_OF_MONTH ) {
          //filter.birthMonth = { $in: extendFilter };
          filter.birthMonth = new Date().getMonth() + 1;
        }
        console.log('filter:', filter);
        return filter;
    }
}