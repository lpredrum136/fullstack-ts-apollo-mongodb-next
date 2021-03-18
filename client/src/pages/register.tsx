import { Button } from '@chakra-ui/button'
import { Box } from '@chakra-ui/layout'
import { Form, Formik } from 'formik'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'

const Register = () => {
  const initialValues = { username: '', password: '' }

  const onRegisterSubmit = values => {
    console.log(values)
  }

  return (
    <Wrapper variant="small">
      <Formik initialValues={initialValues} onSubmit={onRegisterSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label="Username"
              name="username"
              placeholder="Username"
              type="text"
            />
            <Box mt={4}>
              <InputField
                label="Password"
                name="password"
                placeholder="Password"
                type="password"
              />
            </Box>

            <Button
              type="submit"
              colorScheme="teal"
              mt={4}
              isLoading={isSubmitting}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default Register
