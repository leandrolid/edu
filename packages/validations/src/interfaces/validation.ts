export abstract class IValidation<Output> {
  abstract transform<NewOutput>(callback: (data: Output) => NewOutput): IValidation<NewOutput>
  abstract validate(data: any): Output
}

export type InferOutput<T extends Record<string, IValidation<any>>> = {
  [K in keyof T]: ReturnType<T[K]['validate']>
}
