import { PipeTransform, BadRequestException } from '@nestjs/common';
import { VALIDATION_ERROR } from '@scheduling-app/shared-config';
import { z } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodType) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);

      throw new BadRequestException({
        errorType: VALIDATION_ERROR,
        fieldErrors,
      });
    }

    return result.data;
  }
}
