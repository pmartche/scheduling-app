import { AddLocationDto } from '@scheduling-app/shared-schemas';

export const NON_EXISTING_ID = 'eb3df812-b729-4252-aac5-0382c6c408cc';
export const NON_UUID_ID = 'abc';

export const FIRST_BUSINESS_ID = 'a18c2c44-88eb-428f-8656-096acd2851be';
export const SECOND_BUSINESS_ID = '34f7a63e-ed4f-440e-92dc-41da4e5a0950';
export const THIRD_BUSINESS_ID = '8bd49e45-b26e-4757-8dc7-764499dd5049';
export const FOURTH_BUSINESS_ID = 'f4c2d87a-97cf-4c1d-87bd-8f6eabde4a12';

export const FIRST_BUSINESS = { id: FIRST_BUSINESS_ID, name: 'City Bootcamp' };
export const SECOND_BUSINESS = {
  id: SECOND_BUSINESS_ID,
  name: 'Toronto Hair Salon',
};
export const THIRD_BUSINESS = { id: THIRD_BUSINESS_ID, name: 'Ottawa Yoga' };
export const FOURTH_BUSINESS_DTO = {
  name: 'Montreal Fitness Co.',
};
export const FOURTH_BUSINESS = {
  id: FOURTH_BUSINESS_ID,
  ...FOURTH_BUSINESS_DTO,
};

export const BUSINESSES = [FIRST_BUSINESS, SECOND_BUSINESS, THIRD_BUSINESS];

export const NEW_LOCATION_ID = 'd7190d53-4fbc-4c74-b866-8e5b5537a333';
export const NEW_LOCATION_DTO: AddLocationDto = {
  businessId: 'a18c2c44-88eb-428f-8656-096acd2851be',
  name: 'Downtown Bootcamp',
  email: 'team@downtownbootcamp.ca',
  address: '88 Bay St',
  city: 'Toronto',
  postalCode: 'M5J 2T3',
  country: 'Canada',
};
export const NEW_LOCATION = { id: NEW_LOCATION_ID, ...NEW_LOCATION_DTO };

export const LOCATIONS = [
  {
    id: '34417d9e-be0c-47ac-b248-a21e84bd509c',
    businessId: '34f7a63e-ed4f-440e-92dc-41da4e5a0950',
    name: 'Yonge and Eglinton',
    email: 'info@yonge.torontohair.ca',
    address: '3000 Yonge st.',
    city: 'Toronto',
    postalCode: '1A1 A1A',
    country: 'Canada',
  },
  {
    id: 'a4d9f0cb-6b2e-4f88-9fd7-82e0dfe4a111',
    businessId: '34f7a63e-ed4f-440e-92dc-41da4e5a0950',
    name: 'King West Studio',
    email: 'info@kingwest.torontohair.ca',
    address: '120 King St W',
    city: 'Toronto',
    postalCode: 'M5H 1J9',
    country: 'Canada',
  },
  {
    id: 'bc41a955-57f0-4e8b-9f84-71bdc20cd222',
    businessId: '8bd49e45-b26e-4757-8dc7-764499dd5049',
    name: 'Ottawa Riverside',
    email: 'hello@ottawariverside.ca',
    address: '456 Rideau St',
    city: 'Ottawa',
    postalCode: 'K1N 5Y4',
    country: 'Canada',
  },
];
