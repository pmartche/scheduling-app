import { HttpStatus } from '@nestjs/common';
import { prismaErrors } from '../constants/prisma-errors';
import {
  UNIQUE_CONSTRAINT_VIOLATION,
  FOREIGN_KEY_CONSTRAINT_VIOLATION,
  DB_CONSTRAINT_VIOLATION,
  DB_CONNECTION_TIMEOUT,
  REQUIRED_RECORDS_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  PrismaDerivedError,
} from '@scheduling-app/shared-config';

type FilterResponse = { statusCode: HttpStatus; errorType: PrismaDerivedError };

export function mapPrismaErrorToResponse(
  prismaErrorCode: string,
): FilterResponse {
  let statusCode: HttpStatus, errorType: PrismaDerivedError;

  switch (prismaErrorCode) {
    case prismaErrors.uniqueConstraintViolation:
      statusCode = HttpStatus.CONFLICT;
      errorType = UNIQUE_CONSTRAINT_VIOLATION;
      break;
    case prismaErrors.foreignKeyConstraintViolation:
      statusCode = HttpStatus.BAD_REQUEST;
      errorType = FOREIGN_KEY_CONSTRAINT_VIOLATION;
      break;
    case prismaErrors.dbConstraintViolation:
      statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      errorType = DB_CONSTRAINT_VIOLATION;
      break;
    case prismaErrors.dbConnectionTimeout:
      statusCode = HttpStatus.SERVICE_UNAVAILABLE;
      errorType = DB_CONNECTION_TIMEOUT;
      break;
    case prismaErrors.requiredRecordsNotFound:
      statusCode = HttpStatus.NOT_FOUND;
      errorType = REQUIRED_RECORDS_NOT_FOUND;
      break;
    default:
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorType = INTERNAL_SERVER_ERROR;
  }

  return { statusCode, errorType };
}
