import { Button } from '@chakra-ui/button'
import { Box } from '@chakra-ui/layout'
import { Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import {
  AuthInput,
  MeDocument,
  MeQuery,
  useRegisterUserMutation
} from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'

const Register = () => {
  const router = useRouter()

  const [
    registerUser,
    { loading: _registerUserLoading, error, data }
  ] = useRegisterUserMutation()

  const initialValues = { username: '', password: '' }

  const onRegisterSubmit = async (
    values: AuthInput,
    { setErrors }: FormikHelpers<AuthInput>
  ) => {
    const response = await registerUser({
      variables: { registerInput: values },
      update: (cache, { data }) => {
        if (data?.register.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: data.register.user
            }
          })
        }
      }
    })

    if (response.data?.register.errors) {
      setErrors(toErrorMap(response.data.register.errors))
    } else if (
      response.data?.register.success &&
      response.data?.register.accessToken
    ) {
      localStorage.setItem(
        'lireddit-accessToken',
        response.data.register.accessToken
      )
      router.push('/')
    }
  }

  return (
    <Wrapper variant="small">
      {error && <p>Failed to register. Internal server error.</p>}

      {data && data.register.success ? (
        <p>Registered successfully. {JSON.stringify(data)}</p>
      ) : null}

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
