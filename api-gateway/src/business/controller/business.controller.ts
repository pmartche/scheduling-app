import { Body, Controller, Post } from '@nestjs/common';
import { BusinessService } from '../service/business.service';
import { CreateBusinessDto } from '../dto/create-business.dto';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}
  // @Get()
  // findAll():

  @Post()
  async addBusiness(@Body() createBusinessDto: CreateBusinessDto) {
    return await this.businessService.createBusiness(createBusinessDto);
  }
}
