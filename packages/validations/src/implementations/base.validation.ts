import { isArray, isObject } from "radash";
import { ZodSchema } from "zod";
import { IValidation } from "../interfaces/validation";

export class BaseValidation<Output, Schema extends ZodSchema>
  implements IValidation<Output>
{
  constructor(protected schema: Schema) {}

  transform<NewOutput>(
    callback: (data: Output) => NewOutput
  ): IValidation<NewOutput> {
    this.schema = this.schema.transform(callback) as unknown as Schema;
    return this as unknown as IValidation<NewOutput>;
  }

  validate(data: any): Output {
    const res = this.schema.safeParse(data);
    if (res.success) return res.data;
    const error = res.error.errors[0];
    const value =
      isObject(data) || isArray(data) ? JSON.stringify(data) : String(data);
    throw new Error(`${error.message}: ${value}`);
  }

  optional(): this {
    this.schema = this.schema.optional() as unknown as Schema;
    return this;
  }

  nullable(): this {
    this.schema = this.schema.nullable() as unknown as Schema;
    return this;
  }

  nullish(): this {
    this.schema = this.schema.nullish() as unknown as Schema;
    return this;
  }
}
