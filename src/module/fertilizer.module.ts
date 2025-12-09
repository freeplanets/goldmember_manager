import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginToken, LoginTokenSchema } from '../dto/schemas/login-token.schema';
import { FertilizerController } from '../controller/fertilizer.controller';
import { FertilizerService } from '../service/fertilizer.service';
import { InventoryCategory, InventoryCategorySchema } from '../dto/schemas/inventory-category.schema';
import { Inventory, InventorySchema } from '../dto/schemas/inventory.schema';
import { InventoryInOut, InventoryInOutSchema } from '../dto/schemas/inventory-in-out.schema';
import { InventorySummary, InventorySummarySchema } from '../dto/schemas/inventory-summary.schema';

@Module({
    imports: [
        JwtModule,
        MongooseModule.forFeature([
            {name: LoginToken.name, schema: LoginTokenSchema},
            {name: InventoryCategory.name, schema: InventoryCategorySchema},
            {name: Inventory.name, schema: InventorySchema},
            {name: InventoryInOut.name, schema: InventoryInOutSchema},
            {name: InventorySummary.name, schema: InventorySummarySchema},
        ])
    ],
    controllers: [FertilizerController],
    providers: [FertilizerService],
})
export class FertilizerModule {}