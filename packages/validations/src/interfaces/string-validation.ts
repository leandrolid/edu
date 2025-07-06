import { IValidation } from "./validation";

export interface IStringValidation extends IValidation<string> {
  email(): this;
  toLowerCase(): this;
  url(): this;
}
