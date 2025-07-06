import { z, ZodNumber } from "zod";
import { INumberValidation } from "../interfaces/number-validation";
import { BaseValidation } from "./base.validation";

export class NumberValidation
  extends BaseValidation<number, ZodNumber>
  implements INumberValidation
{
  constructor(
    options: {
      coerce?: true;
    } = {}
  ) {
    super(
      z.number({
        invalid_type_error: "Valor inválido",
        required_error: "Valor obrigatório",
        coerce: options.coerce,
      })
    );
  }

  integer(): this {
    this.schema = this.schema.int("Inteiro inválido");
    return this;
  }

  positive(): this {
    this.schema = this.schema.positive("Positivo inválido");
    return this;
  }
}
