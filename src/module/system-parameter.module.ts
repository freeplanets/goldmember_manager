import { Module } from '@nestjs/common';
import { SystemParameterController } from '../controller/system-parameter.controller';
import { SystemParameterService } from '../service/system-parameter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemParameter, SystemParameterSchema } from '../dto/schemas/system-parameter.schema';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SystemParameter.name, schema: SystemParameterSchema },
        ]),
    ],
    controllers: [SystemParameterController],
    providers: [SystemParameterService],
})
export class SystemParameterModule {}