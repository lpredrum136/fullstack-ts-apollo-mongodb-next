import {
  FormControl,
  FormErrorMessage,
  FormLabel
} from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { useField } from 'formik'

type InputFieldProps = {
  name: string
  label: string
  type: string
  placeholder: string
}

const InputField = ({ label, ...props }: InputFieldProps) => {
  const [field, { error }] = useField(props)

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  )
}

export default InputField
