import { IBooleanValidation } from "./boolean-validation";
import { INumberValidation } from "./number-validation";
import { IObjectValidation } from "./object-validation";
import { IStringValidation } from "./string-validation";
import { IValidation } from "./validation";

export interface IValidationBuilder {
  object<T extends Record<string, IValidation<any>>>(
    schema: T
  ): IObjectValidation<T>;
  string(): IStringValidation;
  number(): INumberValidation;
  boolean(): IBooleanValidation;
  readonly coerce: {
    number: () => INumberValidation;
    string: () => IStringValidation;
    boolean: () => IBooleanValidation;
  };
}

export declare let v: IValidationBuilder;
