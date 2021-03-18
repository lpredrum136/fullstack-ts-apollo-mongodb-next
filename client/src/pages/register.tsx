import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Form, Formik } from 'formik'
import Wrapper from '../components/Wrapper'

const Register = () => {
  const initialValues = { username: '', password: '' }

  const onRegisterSubmit = values => {
    console.log(values)
  }

  return (
    <Wrapper variant="small">
      <Formik initialValues={initialValues} onSubmit={onRegisterSubmit}>
        <Form>
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input type="text" placeholder="Username" />
          </FormControl>
        </Form>
      </Formik>
    </Wrapper>
  )
}

export default Register
