import { isObject } from "radash";
import { z, ZodAny } from "zod";
import { IObjectValidation } from "../interfaces/object-validation";
import { InferOutput, IValidation } from "../interfaces/validation";
import { BaseValidation } from "./base.validation";

export class ObjectValidation<Input extends Record<string, IValidation<any>>>
  extends BaseValidation<InferOutput<Input>, ZodAny>
  implements IObjectValidation<Input>
{
  constructor(private readonly validations: Input) {
    super(z.any());
  }

  override validate(data: any): {
    [K in keyof Input]: ReturnType<Input[K]["validate"]>;
  } {
    if (!data) throw new Error("Valor obrigatório: ");
    if (!isObject(data))
      throw new Error(`Valor inválido: ${JSON.stringify(data) ?? ""}`);
    const parsedData: Record<string, any> = {};
    for (const key in this.validations) {
      const validation = this.validations[key];
      parsedData[key] = validation.validate(data[key as string]);
    }
    return super.validate(parsedData);
  }
}
