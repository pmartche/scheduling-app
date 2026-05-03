import { HttpStatus } from '@nestjs/common';
import { mapPrismaErrorToResponse } from './filter-helper-functions';
import { PRISMA_ERROR_TEST_CASES } from './filter-helper-functions.test-data';
import { PrismaDerivedError } from '@scheduling-app/shared-config';

describe('mapPrismaErrorToResponse', () => {
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
  );
});
