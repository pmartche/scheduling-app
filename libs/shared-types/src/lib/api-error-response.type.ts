export type FieldErrors = Record<string, string[]>;

export type ApiErrorResponse = {
  statusCode: number;
  errorType: string;
  fieldErrors?: FieldErrors;
};
