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

export const IS_OBJECT_TEST_CASES: [string, unknown, boolean][] = [
  ['an empty object', {}, true],
  ['an object with properties', { id: 1 }, true],
  ['a `Date` object', new Date(), true],

  ['`null`', null, false],
  ['`undefined`', undefined, false],
  ['an array', [], false],
  ['a string', 'value', false],
  ['a number', 42, false],
  ['a boolean', true, false],
  ['a function', () => undefined, false],
];

export const IS_STRING_ARRAY_TEST_CASES: [string, unknown, boolean][] = [
  ['an empty array', [], true],
  ['an array containing one string', ['value'], true],
  ['an array containing multiple strings', ['one', 'two'], true],
  ['an array containing empty strings', ['', ''], true],

  ['an array containing a number', ['one', 2], false],
  ['an array containing a boolean', ['one', true], false],
  ['an array containing null', ['one', null], false],
  ['an array containing undefined', ['one', undefined], false],
  ['an array containing an object', ['one', {}], false],
  ['an array containing a nested array', ['one', ['two']], false],

  ['a string', 'value', false],
  ['an object', { value: 'one' }, false],
  ['null', null, false],
  ['undefined', undefined, false],
];

export const IS_FIELD_ERRORS: [string, unknown, boolean][] = [
  ['an empty object', {}, true],
  ['an object with one field error', { email: ['Email is required'] }, true],
  [
    'an object with multiple field errors',
    {
      email: ['Email is required', 'Email must be valid'],
      password: ['Password is too short'],
    },
    true,
  ],
  ['an object containing an empty error array', { email: [] }, true],

  ['an object with a string value', { email: 'Email is required' }, false],
  ['an object with a mixed array', { email: ['Email is required', 42] }, false],
  [
    'an object with one valid and one invalid property',
    {
      email: ['Email is required'],
      password: null,
    },
    false,
  ],
  ['an object with a numeric value', { email: 42 }, false],
  ['an object with a nested object', { email: {} }, false],

  ['an array', [['Email is required']], false],
  ['a string', 'Email is required', false],
  ['null', null, false],
  ['undefined', undefined, false],
];
