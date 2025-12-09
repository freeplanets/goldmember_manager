import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { ADbBasicMethods } from "../common/db-basic-methods";
import { InventoryDocument } from "../../dto/schemas/inventory.schema";
import { asyncfunc } from "../common/func.def";
import { IReturnObj } from "../../dto/interface/common.if";
import { IInventory } from "../../dto/interface/fertilizer.if";
import { IUser } from "../../dto/interface/user.if";
import { v1 as uuidv1 } from 'uuid';
import { DB_METHOD } from "../../utils/enum";
import { InventoryCategoryDocument } from "../../dto/schemas/inventory-category.schema";
import { InventorySummaryDocument } from "../../dto/schemas/inventory-summary.schema";
import { ErrCode } from "../../utils/enumError";

export class InventoryOp extends ADbBasicMethods {
    private listItem = 'id name unit product_code category_id alert_quantity unit_price notes';
    constructor(
        private readonly model:Model<InventoryDocument>,
        private readonly modelIC:Model<InventoryCategoryDocument>,
        private readonly modelIS:Model<InventorySummaryDocument>,
    ) {
        super();
    }
    list: asyncfunc = async () => {
        const rtn:IReturnObj = {};
        const ans:IInventory[] = await this.model.find({}, this.listItem);
        const cateIds:string[] = [];
        ans.forEach((itm) => {
            cateIds.push(itm.category_id);
        });
        //rtn.data = ans;
        rtn.data = [];
        if (cateIds.length > 0) {
            const icNames = await this.getNameByIds(cateIds);
            ans.forEach((itm) => {
                itm.category_name = icNames[itm.category_id];
            });
            rtn.data = ans;
        }
        return rtn;
    }

    add: asyncfunc = async (data:Partial<IInventory>, user:Partial<IUser>) => {
        const rtn:IReturnObj = {};
        const f = await this.model.findOne({ name: data.name, unit: data.unit});
        if (!f) {
            if (!data.id) data.id = uuidv1();
            const log = this.createLog(DB_METHOD.ADD, user);
            data.logs = [ log ];
            rtn.data = await this.model.create(data);
        } else {
            rtn.error = ErrCode.INVENTORY_IS_EXISTS;
        }
        return rtn;
    }
    modify: asyncfunc = async (id:string, data:Partial<IInventory>, user:Partial<IUser>) => {
        const rtn:IReturnObj = {};
        const upd:UpdateQuery<InventoryDocument> = data;
        const log = this.createLog(DB_METHOD.MODITY, user);
        upd.$push = { logs: log };
        rtn.data = await this.model.updateOne({id}, data);
        rtn.data.id = id;
        return rtn;
    }
    findOne: asyncfunc = async (id:string) => {
        const rtn:IReturnObj = {};
        rtn.data = await this.model.findOne({id});
        return rtn;
    }
    delete: asyncfunc = async (id:string) => {
        const rtn:IReturnObj = {};
        const fnd = await this.modelIS.findOne({id});
        if (!fnd) {
            rtn.data = await this.model.deleteOne({id});
        } else {
            rtn.error = ErrCode.INVENTORY_IN_USED;
        }
        return rtn;
    }
    async getNameByIds(ids:string[]) {
        const filter:FilterQuery<InventoryCategoryDocument> = {
            id: { $in: ids }
        }
        const finds = await this.modelIC.find(filter);
        const ans = {};
        finds.forEach((itm) => {
            ans[itm.id] = itm.name;
        })
        return ans;
    }
}