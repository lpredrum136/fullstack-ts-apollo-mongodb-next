import { FieldError } from '../generated/graphql'

export const toErrorMap = (errors: FieldError[]) => {
  return errors.reduce(
    (accumulatedErrorsObj, error) => ({
      ...accumulatedErrorsObj,
      [error.field]: error.message
    }),
    {}
  )
}
