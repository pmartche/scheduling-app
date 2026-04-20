import { Module } from '@nestjs/common';
import { BusinessController } from './controller/business.controller';
import { BusinessService } from './service/business.service';

@Module({
  imports: [],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
