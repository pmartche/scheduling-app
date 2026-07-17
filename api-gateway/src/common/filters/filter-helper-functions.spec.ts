import { HttpStatus } from '@nestjs/common';
import {
  isFieldErrors,
  isObject,
  isStringArray,
  mapPrismaErrorToResponse,
} from './filter-helper-functions';
import {
  IS_FIELD_ERRORS,
  IS_OBJECT_TEST_CASES,
  IS_STRING_ARRAY_TEST_CASES,
  PRISMA_ERROR_TEST_CASES,
} from './filter-helper-functions.test-data';
import { PrismaDerivedError } from '@scheduling-app/shared-config';

describe('mapPrismaErrorToResponse', () =>
  it.each(PRISMA_ERROR_TEST_CASES)(
    'maps prisma error %s to status %s and error type %s',
    (
      prismaError: string,
      statusCode: HttpStatus,
      errorType: PrismaDerivedError,
    ) =>
      expect(mapPrismaErrorToResponse(prismaError)).toEqual({
        statusCode,
        errorType,
      }),
  ));

describe('isObject', () =>
  it.each(IS_OBJECT_TEST_CASES)(
    'returns the expected result for %s',
    (_, input: unknown, expectedResult: boolean) =>
      expect(isObject(input)).toBe(expectedResult),
  ));

describe('isSTringArray', () =>
  it.each(IS_STRING_ARRAY_TEST_CASES)(
    'returns the expected result for %s',
    (_, input: unknown, expectedResult: boolean) =>
      expect(isStringArray(input)).toBe(expectedResult),
  ));

describe('isFieldErrors', () =>
  it.each(IS_FIELD_ERRORS)(
    'returns the expected result for %s',
    (_, input: unknown, expectedResult: boolean) =>
      expect(isFieldErrors(input)).toBe(expectedResult),
  ));
