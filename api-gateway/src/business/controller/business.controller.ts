import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BusinessService } from '../service/business.service';
import { CreateBusinessDto } from '../dto/create-business.dto';
import { AddLocationDto } from '../dto/add-location.dto';
import { UpdateBusinessDto } from '../dto/update-business.dto';
import { ROUTE_BODY_ID_MISMATCH } from '../../common/constants/error-messages';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  addBusiness(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.createBusiness(createBusinessDto);
  }

  @Post()
  addLocation(@Body() addLocationDto: AddLocationDto) {
    return this.businessService.addLocation(addLocationDto);
  }

  @Put(':id')
  updateLocation(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    if (id !== updateBusinessDto.id)
      throw new BadRequestException(ROUTE_BODY_ID_MISMATCH);

    return this.businessService.updateBusiness(updateBusinessDto);
  }
}
