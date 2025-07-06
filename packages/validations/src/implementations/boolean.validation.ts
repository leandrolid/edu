import { z, ZodBoolean } from "zod";
import { IBooleanValidation } from "../interfaces/boolean-validation";
import { BaseValidation } from "./base.validation";

export class BooleanValidation
  extends BaseValidation<boolean, ZodBoolean>
  implements IBooleanValidation
{
  constructor(private options: { coerce?: true } = {}) {
    super(
      z.boolean({
        invalid_type_error: "Valor inválido",
        required_error: "Valor obrigatório",
      })
    );
  }

  override validate(data: any): boolean {
    return super.validate(this.options.coerce ? String(data) === "true" : data);
  }
}
