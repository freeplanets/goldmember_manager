import { Injectable } from '@nestjs/common';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { IUser } from '../dto/interface/user.if';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { InventoryCategory, InventoryCategoryDocument } from '../dto/schemas/inventory-category.schema';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { InventoryCategoryOp } from '../classes/fertilizer/inventory-category-op';
import { FuncWithTryCatchNew } from '../classes/common/func.def';
import { Inventory, InventoryDocument } from '../dto/schemas/inventory.schema';
import { InventoryOp } from '../classes/fertilizer/inventory-op';
import { IInventory, IStockInOut } from '../dto/interface/fertilizer.if';
import { InventoryInOut, InventoryInOutDocument } from '../dto/schemas/inventory-in-out.schema';
import { InventoryInOutOp } from '../classes/fertilizer/inventory-in-out-op';
import { DateRangeQueryReqDto } from '../dto/common/date-range-query-request.dto';
import { DateLocale } from '../classes/common/date-locale';
import { InventorySummary, InventorySummaryDocument } from '../dto/schemas/inventory-summary.schema';

@Injectable()
export class FertilizerService {
    private icOp:InventoryCategoryOp;
    private invOp:InventoryOp;
    private invIO:InventoryInOutOp;
    private myDate = new DateLocale();
    constructor(
        @InjectModel(InventoryCategory.name) private readonly modelIC:Model<InventoryCategoryDocument>,
        @InjectModel(Inventory.name) private readonly modelInv:Model<InventoryDocument>,
        @InjectModel(InventoryInOut.name) private readonly modelInvIO:Model<InventoryInOutDocument>,
        @InjectModel(InventorySummary.name) private readonly modelIS:Model<InventorySummaryDocument>,
        @InjectConnection() private readonly connection: mongoose.Connection,
    ){
        this.icOp = new InventoryCategoryOp(this.modelIC, this.modelInv);
        this.invOp = new InventoryOp(this.modelInv, this.modelIC, this.modelIS);
        this.invIO = new InventoryInOutOp(this.modelInvIO, this.modelInv, this.modelIC, this.modelIS, connection);
    }
    async getCategories() {
        return FuncWithTryCatchNew(this.icOp, 'list');
    }
    async addCategory(name:string, user:Partial<IUser>) {
        return FuncWithTryCatchNew(this.icOp, 'add', name, user);
    }
    async modifyCategory(id:string, name:string, user:Partial<IUser>) {
        return FuncWithTryCatchNew(this.icOp, 'modify', id, name, user);
    }
    async delCategory(id:string) {
        return FuncWithTryCatchNew(this.icOp, 'delete', id);
    }
    async getInventories(){
        return FuncWithTryCatchNew(this.invOp, 'list');
    }
    async addInventory(data:Partial<IInventory>, user:Partial<IUser>) {
        return FuncWithTryCatchNew(this.invOp, 'add',  data, user);
    }
    async modifyInventory(id:string, data:Partial<IInventory>, user:Partial<IUser>) {
        return FuncWithTryCatchNew(this.invOp, 'modify', id, data, user);
    }
    async delInventory(id:string) {
        return FuncWithTryCatchNew(this.invOp , 'delete', id);
    }
    async getStockIn(dates:DateRangeQueryReqDto){
        return this.getStockInOut(dates, 1);
    }
    async getStockOut(dates:DateRangeQueryReqDto){
        return this.getStockInOut(dates, -1);
    }
    private async getStockInOut(dates:DateRangeQueryReqDto, calMark: 1 | -1) {
        const filter:FilterQuery<InventoryInOutDocument> = {}
        const startDate = dates.startDate ? dates.startDate : this.myDate.toDateString();
        const endDate = dates.endDate? dates.endDate : startDate;
        filter.$and = [
            { date: {$gte: startDate}},
            { date: { $lte: endDate }},
        ];
        filter.calMark = calMark;
        return FuncWithTryCatchNew(this.invIO, 'list', filter);
    }
    async stockin(data:Partial<IStockInOut>, user:Partial<IUser>) {
        data.calMark = 1;
        return FuncWithTryCatchNew(this.invIO, 'add', data, user);
    }
    async stockout(data:Partial<IStockInOut>, user:Partial<IUser>) {
        data.calMark = -1;
        return FuncWithTryCatchNew(this.invIO, 'add', data, user);
    }
    async getSummary() {
        return FuncWithTryCatchNew(this.invIO, 'getSummary');
    }
}