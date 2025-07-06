import { z, ZodString } from "zod";
import { IStringValidation } from "../interfaces/string-validation";
import { BaseValidation } from "./base.validation";

export class StringValidation
  extends BaseValidation<string, ZodString>
  implements IStringValidation
{
  constructor(
    options: {
      coerce?: true;
    } = {}
  ) {
    super(
      z.string({
        invalid_type_error: "Valor inválido",
        required_error: "Valor obrigatório",
        coerce: options.coerce,
      })
    );
  }

  email(): this {
    this.schema = this.schema.email("E-mail inválido");
    return this;
  }

  toLowerCase(): this {
    this.schema = this.schema.toLowerCase();
    return this;
  }

  url(): this {
    this.schema = this.schema.url("URL inválida");
    return this;
  }
}
