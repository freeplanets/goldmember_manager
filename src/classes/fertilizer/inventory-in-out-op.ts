import mongoose, { ClientSession, FilterQuery, Model, UpdateQuery } from 'mongoose';
import { InventoryInOutDocument } from '../../dto/schemas/inventory-in-out.schema';
import { ADbBasicMethods } from '../common/db-basic-methods';
import { asyncfunc } from '../common/func.def';
import { IbulkWriteItem, IReturnObj } from '../../dto/interface/common.if';
import { InventoryDocument } from '../../dto/schemas/inventory.schema';
import { InventoryCategoryDocument } from '../../dto/schemas/inventory-category.schema';
import { IInventory, IStockInOut, IStockSummary } from '../../dto/interface/fertilizer.if';
import { IUser } from '../../dto/interface/user.if';
import { InventorySummaryDocument } from '../../dto/schemas/inventory-summary.schema';
import { ErrCode } from '../../utils/enumError';
import { v1 as uuidv1 } from 'uuid';

export class InventoryInOutOp extends ADbBasicMethods { 
    constructor(
        private readonly model:Model<InventoryInOutDocument>,
        private readonly modelInv:Model<InventoryDocument>,
        private readonly modelIC:Model<InventoryCategoryDocument>,
        private readonly modelIS:Model<InventorySummaryDocument>,
        private readonly connection:mongoose.Connection,
    ){
        super();
    }
    list: asyncfunc = async (filter:FilterQuery<InventoryInOutDocument>) => {
        const rtn:IReturnObj = {};
        const finds:Partial<IStockInOut>[] = await this.model.find(filter);
        const inv_ids:string[] = [];
        finds.forEach((itm) => {
            inv_ids.push(itm.product_id);
        })
        const lists = [];
        if (inv_ids.length > 0) {
            const invs = await this.getInventory(inv_ids);
            //console.log('list invs:',invs);
            finds.forEach((itm) => {
                const inv = invs[itm.product_id];
                //console.log('finds itm:', itm, inv);
                itm.product_name = inv.name;
                itm.category_name = inv.category_name;
                itm.product_unit = inv.unit;
                lists.push(itm);
            })
        }
        rtn.data = lists; //finds;
        return rtn;
    }
    add: asyncfunc = async (data:Partial<IStockInOut>, user:Partial<IUser>) => {
        const rtn:IReturnObj = {};
        data.creator = user.username;
        data.id = uuidv1();
        const session = await this.connection.startSession();
        session.startTransaction();
        const ans = await this.modifySummary(data, session);
        if (ans) {
            const created = await this.model.create([data], {session});
            if (created) {
                await session.commitTransaction();
                rtn.data = created;
            } else {
                rtn.error = ErrCode.UNEXPECTED_ERROR_ARISE;
                await session.abortTransaction();
            }
            await session.endSession();
        }
        return rtn;
    } 
    modify: asyncfunc = async (id:string, data:Partial<IStockInOut>, user:Partial<IUser>) => {
        const rtn:IReturnObj = {};
        //data.handler = user.username;
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
        rtn.data = await this.model.deleteOne({});
        return rtn;
    }
    async getSummary() {
        const rtn:IReturnObj = {};
        const finds:Partial<IStockSummary>[] = await this.modelIS.find();
        const inv_ids:string[] = [];
        finds.forEach((itm) => {
            inv_ids.push(itm.id);
        });
        console.log('inv_ids:', inv_ids);
        let rlt:IStockSummary[] = [];
        if (inv_ids.length > 0) {
            const invs = await this.getInventory(inv_ids);
            rlt = finds.map((itm) => {
                const inv = invs[itm.id];
                console.log('invs:', inv);
                const ss:IStockSummary = {
                    id:	itm.id,
                    name: inv.name,
                    unit: inv.unit,
                    product_code: inv.product_code,
                    category_name: inv.category_name,
                    total_in: itm.total_in,   //進貨總量
                    total_out: itm.total_out,  //出貨總量
                    stock: itm.stock,  //庫存（進貨總量 - 出貨總量）
                    alert_quantity: inv.alert_quantity, //警示存量
                    notes: inv.notes,  //備註                     
                }
                // itm.name = inv.name;
                // itm.category_name = inv.category_name;
                // itm.unit = inv.unit;
                // itm.alert_quantity = inv.alert_quantity;
                // itm.notes = inv.notes;
                return ss;
            });
        }
        rtn.data = rlt;
        return rtn;        
    }
    async getInventory(ids:string[]) {
        const ans:Partial<IInventory>[] = await this.modelInv.find(
            {id: { $in: ids}}, 'id name unit product_code category_id alert_quantity notes');
        const cate_ids:string[] = [];
        ans.forEach((itm) => {
            cate_ids.push(itm.category_id);
        });
        const invs:{[key:string]:Partial<IInventory>} = {};
        if (cate_ids.length > 0) {
            const list = await this.getCategories(cate_ids);
            ans.forEach((itm) => {
                itm.category_name = list[itm.category_id];
                invs[itm.id] = itm;
            })
        }
        return invs;
    };
    async getCategories(ids:string[]) {
        const ans = await this.modelIC.find({id: {$in: ids}}, 'id name');
        const list = {};
        ans.forEach((itm) => {
            list[itm.id] = itm.name;
        });
        return list;
    }
    async modifySummary(data:Partial<IStockInOut>, session:ClientSession) {
        const f = await this.modelIS.findOne({id: data.product_id});
        const bulk:IbulkWriteItem<InventorySummaryDocument> = {};
        if (f) {
            const filter:FilterQuery<InventorySummaryDocument> =  {id: f.id};
            let update:UpdateQuery<InventorySummaryDocument>;
            if (data.calMark > 0) {
                update = {
                    total_in: f.total_in + data.quantity,
                    stock: f.stock + data.quantity,
                }
            } else {
                update = {
                    total_out: f.total_out + data.quantity,
                    stock: f.stock - data.quantity,
                }
            }
            bulk.updateOne = {
                filter,
                update
            }
        } else {
            let total_in = 0, total_out = 0;
            if (data.calMark > 0) {
                total_in = data.quantity;
            } else {
                total_out = data.quantity;
            }
            const doc:Partial<IStockSummary> = {
                id: data.product_id,
                total_in,
                total_out,
                stock: total_in - total_out,
            }
            bulk.insertOne = { document: doc as InventorySummaryDocument };
        }
        console.log('bulk:', bulk, bulk.updateOne);
        const ans = await this.modelIS.bulkWrite([bulk as any], {session});
        console.log('modifySummary:', ans);
        return (ans.insertedCount + ans.modifiedCount) > 0;
    }
}