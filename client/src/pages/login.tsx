import { Formik, Form, FormikHelpers } from 'formik'

import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import { Box, Button } from '@chakra-ui/react'
import {
  AuthInput,
  useLoginUserMutation,
  // UserInfoFragmentDoc,
  MeDocument,
  MeQuery
} from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'

import { useRouter } from 'next/router'

// import { login } from '../graphql-client/mutations/mutations' // old, without graphql codegen
// import { useMutation } from '@apollo/client' // old, without graphql codegen

const Login = () => {
  // Router Next
  const router = useRouter()

  // Form
  const initialValues = {
    username: '',
    password: ''
  }

  const onLoginSubmit = async (
    values: AuthInput,
    { setErrors }: FormikHelpers<AuthInput>
  ) => {
    // o params ben tren: values cung duoc nhung neu client/tsconfig.json/strict la true thi no se bat loi
    // con cai setErrors la tu may mo ra day haha

    const response = await loginUser({
      variables: { loginInput: values },

      // CACH 1: DUNG cache.modify()
      // {data} o day la data nhan lai khi gui mutation di, tuc la co dang goc cua graphql: data: {login: {success: ..., code: ..., ..., user: {...}}}
      // thi cai data de writeFragment phai tuong ung voi cai shape cua fragment, la object co {id, username}
      /* update(cache, { data }) {
        cache.modify({
          fields: {
            me(oldMe) {
              console.log('DATA', data)
              console.log(oldMe)

              if (data?.login.success) {
                const newMe = cache.writeFragment({
                  data: data?.login.user,
                  fragment: UserInfoFragmentDoc
                })

                return newMe
              } else {
                return oldMe
              }
            }
          }
        })
      } */

      // CACH 2: DUNG cache.readQuery() va cache.writeQuery()
      update(cache, { data }) {
        const meData = cache.readQuery<MeQuery>({
          query: MeDocument
        }) // buoc nay trong truong hop nay thuc ra khong can vi co thay doi cai "me" nay dau. Nhung no la cai suon` cho nhieu truong hop khac.
        // meData here is {me: {id, username}}

        console.log(meData)

        if (data?.login.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: data.login.user // nho la data.login.user o day phai trung voi shape cua "me", tuc la co id va username, vay nen Fragment la rat can thiet
            }
          })
        }
      }

      // CACH 3: DUNG refetchQueries qua de
    }) // response here is the {data: ....} below, when you use useloginUserMutation(). So you can response.data.login.user

    if (response.data?.login.errors) {
      // if you do response.data.login.errors, if response.data is undefined, it will throw an error
      // adding a '?' to response.data says: if it's not undefined, dig down to login.errors, but if it is undefined, return undefined

      // For example, setErrors() is from Formik
      // setErrors({
      //   username: 'Hi error'
      // })

      setErrors(toErrorMap(response.data.login.errors))
    } else if (
      response.data?.login.success &&
      response.data?.login.accessToken
    ) {
      // login successful
      localStorage.setItem(
        'lireddit-accessToken',
        response.data.login.accessToken
      )
      router.push('/')
    }
  }

  // GraphQL operations

  const [
    loginUser,
    { loading: _loginUserLoading, error, data }
  ] = useLoginUserMutation() // custom hook created by graphql codegen
  // error here is server error, kinda like you have a typo somewhere
  // data is real structured data returned from GraphQL server (if you didn't make any typo)

  return (
    <Wrapper variant="small">
      {error && <p>Failed to login. Server error.</p>}

      {data && data.login.success ? (
        <p>logined successfully {JSON.stringify(data)}</p>
      ) : null}

      <Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="Username"
              label="Username"
              type="text"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
              />
            </Box>

            <Button
              type="submit"
              colorScheme="teal"
              mt={4}
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default Login
