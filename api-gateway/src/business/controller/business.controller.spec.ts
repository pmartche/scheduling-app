import { BadRequestException, HttpException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BusinessService } from '../service/business.service';
import { BusinessController } from './business.controller';
import {
  BUSINESSES,
  FIRST_BUSINESS_ID,
  FOURTH_BUSINESS,
  FOURTH_BUSINESS_DTO,
  FOURTH_BUSINESS_ID,
  NEW_LOCATION,
  NEW_LOCATION_DTO,
  NEW_LOCATION_ID,
  SECOND_BUSINESS,
  SECOND_BUSINESS_ID,
  THIRD_BUSINESS,
} from './business.controller.test-data';
import { ROUTE_BODY_AND_ID_MISMATCH } from '@scheduling-app/shared-config';

describe('BusinessController', () => {
  let businessController: BusinessController;
  let businessService: BusinessService;

  beforeEach(() => {
    businessService = new BusinessService(new PrismaService());
    businessController = new BusinessController(businessService);
  });

  describe('getBusenesses', () => {
    it('calls the business service w/o params and returns its result', async () => {
      jest
        .spyOn(businessService, 'getBusinesses')
        .mockResolvedValue(BUSINESSES);

      await expect(businessController.getBusinesses()).resolves.toEqual(
        BUSINESSES,
      );

      expect(businessService.getBusinesses).toHaveBeenCalledTimes(1);
      expect(businessService.getBusinesses).toHaveBeenCalledWith();
    });
  });

  describe('getBusinessById', () => {
    it('calls the business service with the ID and returns its result', async () => {
      jest
        .spyOn(businessService, 'getBusinessById')
        .mockResolvedValue(SECOND_BUSINESS);

      await expect(
        businessController.getBusinessById(SECOND_BUSINESS_ID),
      ).resolves.toEqual(SECOND_BUSINESS);

      expect(businessService.getBusinessById).toHaveBeenCalledWith(
        SECOND_BUSINESS_ID,
      );
      expect(businessService.getBusinessById).toHaveBeenCalledTimes(1);
    });
  });

  describe('addBusiness', () => {
    it('calls a business service with the request body and returns the result', async () => {
      jest
        .spyOn(businessService, 'createBusiness')
        .mockResolvedValue(FOURTH_BUSINESS);

      await expect(
        businessController.addBusiness(FOURTH_BUSINESS_DTO),
      ).resolves.toEqual(FOURTH_BUSINESS);

      expect(businessService.createBusiness).toHaveBeenCalledWith(
        FOURTH_BUSINESS_DTO,
      );
      expect(businessService.createBusiness).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateBusiness', () => {
    it('calls the business service with the body object and returns its result when IDs match', async () => {
      jest
        .spyOn(businessService, 'updateBusiness')
        .mockResolvedValue(FOURTH_BUSINESS);

      await expect(
        businessController.updateBusiness(FOURTH_BUSINESS_ID, FOURTH_BUSINESS),
      ).resolves.toEqual(FOURTH_BUSINESS);

      expect(businessService.updateBusiness).toHaveBeenCalledWith(
        FOURTH_BUSINESS,
      );
      expect(businessService.updateBusiness).toHaveBeenCalledTimes(1);
    });

    it("throws a bad request with `ROUTE_BODY_AND_ID_MISMATCH` when route ID doesn't match body ID", async () => {
      jest.spyOn(businessService, 'updateBusiness');

      try {
        businessController.updateBusiness(FOURTH_BUSINESS_ID, THIRD_BUSINESS);
        expect(businessController.updateBusiness).toThrow();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);

        const exception = error as BadRequestException;

        expect(exception.getResponse()).toMatchObject({
          message: ROUTE_BODY_AND_ID_MISMATCH,
        });
      }

      expect(businessService.updateBusiness).not.toHaveBeenCalled();
    });
  });

  describe('addLocation', () => {
    it('calls the business service with the body object and returns its result when IDs match', async () => {
      jest
        .spyOn(businessService, 'addLocation')
        .mockResolvedValue(NEW_LOCATION);

      await expect(
        businessService.addLocation(NEW_LOCATION_DTO),
      ).resolves.toEqual(NEW_LOCATION);

      expect(businessService.addLocation).toHaveBeenCalledWith(
        NEW_LOCATION_DTO,
      );
      expect(businessService.addLocation).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateLocation', () => {
    it('calls the business service with the body object and returns its result when IDs match', async () => {
      jest
        .spyOn(businessService, 'updateLocation')
        .mockResolvedValue(NEW_LOCATION);

      await expect(
        businessController.updateLocation(NEW_LOCATION_ID, NEW_LOCATION),
      ).resolves.toEqual(NEW_LOCATION);

      expect(businessService.updateLocation).toHaveBeenCalledWith(NEW_LOCATION);
      expect(businessService.updateLocation).toHaveBeenCalledTimes(1);
    });

    it("throws a bad request with `ROUTE_BODY_AND_ID_MISMATCH` when route ID doesn't match body ID", async () => {
      jest.spyOn(businessService, 'updateLocation');

      try {
        businessController.updateLocation(FIRST_BUSINESS_ID, NEW_LOCATION);
        expect(businessController.updateLocation).toThrow();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);

        const exception = error as BadRequestException;

        expect(exception.getResponse()).toMatchObject({
          message: ROUTE_BODY_AND_ID_MISMATCH,
        });
      }

      expect(businessService.updateLocation).not.toHaveBeenCalled();
    });
  });
});
