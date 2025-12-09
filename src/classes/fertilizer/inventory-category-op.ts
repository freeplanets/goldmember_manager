import { FilterQuery, Model } from 'mongoose';
import { InventoryCategoryDocument } from '../../dto/schemas/inventory-category.schema';
import { IUser } from '../../dto/interface/user.if';
import { IReturnObj } from '../../dto/interface/common.if';
import { ErrCode } from '../../utils/enumError';
import { v1 as uuidv1 } from 'uuid';
import { ADbBasicMethods } from '../common/db-basic-methods';
import { asyncfunc } from '../common/func.def';
import { DB_METHOD } from '../../utils/enum';
import { InventoryDocument } from '../../dto/schemas/inventory.schema';

export class InventoryCategoryOp extends ADbBasicMethods{
    constructor(
        private model:Model<InventoryCategoryDocument>,
        private modelInv:Model<InventoryDocument>,
    ){
        super();
    }
    list: asyncfunc = async():Promise<any> => {
       const rtn:IReturnObj = {};
       rtn.data = await this.model.find({},'id name');
       return rtn; 
    }
    findOne: asyncfunc = async(id: string):Promise<any> => {
       const rtn:IReturnObj = {};
       rtn.data = await this.model.findOne({id});
       return rtn; 
    }
    add: asyncfunc = async (name:string, user:Partial<IUser>):Promise<any> => {
        const rtn:IReturnObj = {};
        const f = await this.model.findOne({name});
        if (f) {
            rtn.error = ErrCode.CATEGORY_EXISTS;
        } else {
            const log = this.createLog(DB_METHOD.ADD, user);
            rtn.data = await this.model.create({
                id: uuidv1(),
                name,
                logs: [ log ],
            });
        }
        return rtn;
    }
    modify:asyncfunc = async (id:string, name:string, user:Partial<IUser>):Promise<any> => {
        const rtn:IReturnObj = {};
        const f = await this.model.findOne({id});
        if (f) {
            if (name !== f.name) {
                const log = this.createLog(DB_METHOD.MODITY, user);
                rtn.data = await this.model.updateOne(
                    { id },
                    { 
                        name,
                        $push: {logs: log},
                    }
                );
                rtn.data.id = id;
            } else {
                rtn.error = ErrCode.SAME_NAME;
            }
        } else {
            rtn.error = ErrCode.ITEM_NOT_FOUND;
        }
        return rtn;        
    }
    delete:asyncfunc = async (id:string):Promise<any> => {
        const rtn:IReturnObj = {};
        const isInUsed = await this.isCategoryInUsed(id);
        if (!isInUsed) {
            rtn.data = await this.model.deleteOne({id});
        } else {
            rtn.error = ErrCode.CATEGORY_IN_USED;
        }
        return rtn;
    }
    async isCategoryInUsed(category_id:string) {
        const fnd = await this.modelInv.find({category_id});
        return fnd.length > 0;
    }
}