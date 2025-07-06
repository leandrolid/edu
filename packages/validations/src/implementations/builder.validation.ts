import { IBooleanValidation } from "../interfaces/boolean-validation";
import { IValidation } from "../interfaces/validation";
import { IValidationBuilder } from "../interfaces/validation-builder";
import { BooleanValidation } from "./boolean.validation";
import { NumberValidation } from "./number.validation";
import { ObjectValidation } from "./object.validation";
import { StringValidation } from "./string.validation";

export class ValidationBuilder implements IValidationBuilder {
  object<T extends Record<string, IValidation<any>>>(
    schema: T
  ): ObjectValidation<T> {
    return new ObjectValidation(schema);
  }

  string(): StringValidation {
    return new StringValidation();
  }

  number(): NumberValidation {
    return new NumberValidation();
  }

  boolean(): IBooleanValidation {
    return new BooleanValidation();
  }

  get coerce() {
    return {
      number: () => new NumberValidation({ coerce: true }),
      string: () => new StringValidation({ coerce: true }),
      boolean: () => new BooleanValidation({ coerce: true }),
    };
  }
}
