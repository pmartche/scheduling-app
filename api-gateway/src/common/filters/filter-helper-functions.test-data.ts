import { HttpStatus } from '@nestjs/common';
import {
  DB_CONNECTION_TIMEOUT,
  DB_CONSTRAINT_VIOLATION,
  FOREIGN_KEY_CONSTRAINT_VIOLATION,
  INTERNAL_SERVER_ERROR,
  PrismaDerivedError,
  REQUIRED_RECORDS_NOT_FOUND,
  UNIQUE_CONSTRAINT_VIOLATION,
} from '@scheduling-app/shared-config';
import { prismaErrors } from '../constants/prisma-errors';

export const PRISMA_ERROR_TEST_CASES: [
  string,
  HttpStatus,
  PrismaDerivedError,
][] = [
  [
    prismaErrors.uniqueConstraintViolation,
    HttpStatus.CONFLICT,
    UNIQUE_CONSTRAINT_VIOLATION,
  ],
  [
    prismaErrors.foreignKeyConstraintViolation,
    HttpStatus.BAD_REQUEST,
    FOREIGN_KEY_CONSTRAINT_VIOLATION,
  ],
  [
    prismaErrors.dbConstraintViolation,
    HttpStatus.UNPROCESSABLE_ENTITY,
    DB_CONSTRAINT_VIOLATION,
  ],
  [
    prismaErrors.dbConnectionTimeout,
    HttpStatus.SERVICE_UNAVAILABLE,
    DB_CONNECTION_TIMEOUT,
  ],
  [
    prismaErrors.requiredRecordsNotFound,
    HttpStatus.NOT_FOUND,
    REQUIRED_RECORDS_NOT_FOUND,
  ],
  ['ABC', HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR],
];
