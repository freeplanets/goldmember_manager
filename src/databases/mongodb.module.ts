import { Module } from '@nestjs/common';
import { MongodbProviders } from './mongodb.providers';

@Module({
  providers: [...MongodbProviders],
  exports: [...MongodbProviders],
})
export class MongodbModule {}
