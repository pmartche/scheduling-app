import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma-exception.filter';
import { FOREIGN_KEY_CONSTRAINT_VIOLATION } from '@scheduling-app/shared-config';
import { mapPrismaErrorToResponse } from './filter-helper-functions';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

jest.mock('./filter-helper-functions');

describe('PrismaExceptionFilter', () => {
  let prismaExceptionFilter: PrismaExceptionFilter;

  beforeEach(() => (prismaExceptionFilter = new PrismaExceptionFilter()));

  it('attaches an HTTP status code and error type to response', () => {
    const prismaErrorCode = 'ABC';

    const exception = {
      code: prismaErrorCode,
    } as PrismaClientKnownRequestError;

    const responseObject = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const host = {
      switchToHttp: () => ({
        getResponse: () => responseObject,
      }),
    } as ArgumentsHost;

    const statusCode = HttpStatus.BAD_REQUEST;
    const errorType = FOREIGN_KEY_CONSTRAINT_VIOLATION;
    const mappedErrorResponse = { statusCode, errorType };

    (mapPrismaErrorToResponse as jest.Mock).mockReturnValue(
      mappedErrorResponse,
    );

    prismaExceptionFilter.catch(exception, host);

    const { status: statusFn, json: jsonFn } = responseObject;

    expect(mapPrismaErrorToResponse).toHaveBeenCalledWith(prismaErrorCode);
    expect(statusFn).toHaveBeenCalledWith(statusCode);
    expect(jsonFn).toHaveBeenCalledWith(mappedErrorResponse);
    expect(mapPrismaErrorToResponse).toHaveBeenCalledTimes(1);
    expect(statusFn).toHaveBeenCalledTimes(1);
    expect(jsonFn).toHaveBeenCalledTimes(1);
  });
});
