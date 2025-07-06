import { IValidation } from "./validation";

export interface INumberValidation extends IValidation<number> {
  integer(): this;
  positive(): this;
}
