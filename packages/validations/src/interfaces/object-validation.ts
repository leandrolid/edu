import { InferOutput, IValidation } from "./validation";

export interface IObjectValidation<
  Input extends Record<string, IValidation<any>>,
> extends IValidation<InferOutput<Input>> {
  validate(data: any): {
    [K in keyof Input]: ReturnType<Input[K]["validate"]>;
  };
}
