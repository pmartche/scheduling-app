import z from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { VALIDATION_ERROR } from '@scheduling-app/shared-config';

const ID_ERROR_MESSAGE = 'id must be a number';
const NAME_ERROR_MESSAGE = 'name must be a non-empty string';

describe('ZodValidationPipe', () => {
  let pipe: ZodValidationPipe;
  const testSchema: z.ZodType = z
    .object({
      id: z.number(ID_ERROR_MESSAGE),
      name: z.string(NAME_ERROR_MESSAGE).trim(),
    })
    .required();

  beforeEach(() => (pipe = new ZodValidationPipe(testSchema)));

  it('returns the input value when said value conforms to the test schema', () => {
    const input = { id: 5, name: 'John' };

    expect(pipe.transform(input)).toEqual(input);
  });

  it('returns transformed input when schema transforms', () => {
    const input = { id: 5, name: '   John   ' };

    expect(pipe.transform(input)).toEqual({
      ...input,
      name: input.name.trim(),
    });
  });

  it("throws a bad request exception when the input value doesn't conform to the test schema", () => {
    const input = { id: 'John', name: 5 };
    const fieldErrors = {
      id: [ID_ERROR_MESSAGE],
      name: [NAME_ERROR_MESSAGE],
    };
    const exceptionResponse = {
      errorType: VALIDATION_ERROR,
      fieldErrors,
    };

    try {
      pipe.transform(input);

      throw new Error("pipe should've thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);

      const exception = error as BadRequestException;

      expect(exception?.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception?.getResponse()).toEqual(exceptionResponse);
    }
  });
});
