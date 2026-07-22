import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { BusinessService } from '../service/business.service';
import {
  addLocationSchema,
  createBusinessSchema,
  updateBusinessSchema,
  updateLocationSchema,
  type AddLocationDto,
  type CreateBusinessDto,
  type UpdateBusinessDto,
  type UpdateLocationDto,
} from '@scheduling-app/shared-schemas';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { ROUTE_BODY_AND_ID_MISMATCH } from '@scheduling-app/shared-config';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  getBusinesses() {
    return this.businessService.getBusinesses();
  }

  @Get(':id')
  getBusinessById(@Param('id', ParseUUIDPipe) id: string) {
    return this.businessService.getBusinessById(id);
  }

  @Post()
  addBusiness(
    @Body(new ZodValidationPipe(createBusinessSchema))
    createBusinessDto: CreateBusinessDto,
  ) {
    return this.businessService.createBusiness(createBusinessDto);
  }

  @Put(':id')
  updateBusiness(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateBusinessSchema))
    updateBusinessDto: UpdateBusinessDto,
  ) {
    if (id !== updateBusinessDto.id)
      throw new BadRequestException(ROUTE_BODY_AND_ID_MISMATCH);

    return this.businessService.updateBusiness(updateBusinessDto);
  }

  @Post()
  addLocation(
    @Body(new ZodValidationPipe(addLocationSchema))
    addLocationDto: AddLocationDto,
  ) {
    return this.businessService.addLocation(addLocationDto);
  }

  @Put(':id')
  updateLocation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateLocationSchema))
    updateLocationDto: UpdateLocationDto,
  ) {
    if (id !== updateLocationDto.id)
      throw new BadRequestException(ROUTE_BODY_AND_ID_MISMATCH);

    return this.businessService.updateLocation(updateLocationDto);
  }
}
