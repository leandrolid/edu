import { ValidationBuilder } from "./implementations/builder.validation";
import type { IValidationBuilder } from "./interfaces/validation-builder";

export const z: IValidationBuilder = new ValidationBuilder();
