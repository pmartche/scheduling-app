import { mapPrismaErrorToResponse } from './filter-helper-functions';
import { PRISMA_ERROR_TEST_CASES } from './filter-helper-functions.test-data';

describe('mapPrismaErrorToResponse', () => {
  it.each(PRISMA_ERROR_TEST_CASES)(
    'maps prisma error %s to status %s and error type %s',
    (prismaError, statusCode, errorType) =>
      expect(mapPrismaErrorToResponse(prismaError)).toEqual({
        statusCode,
        errorType,
      }),
  );
});
