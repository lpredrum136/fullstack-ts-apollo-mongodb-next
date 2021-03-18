import { useApolloClient } from '@apollo/client'
import { Button } from '@chakra-ui/button'
import { Box, Flex, Link } from '@chakra-ui/layout'
import NextLink from 'next/link'
import { MeDocument, MeQuery, useMeQuery } from '../generated/graphql'

const Navbar = () => {
  const client = useApolloClient()

  const { data, loading, error: _useMeQueryError } = useMeQuery()

  const logout = () => {
    localStorage.removeItem('lireddit-accessToken')
    client.writeQuery<MeQuery>({
      query: MeDocument,
      data: {
        me: null
      }
    })
  }

  let body = null

  if (loading) {
    // do nothing, body === null
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    )
  } else {
    body = (
      <Flex>
        <Box mr={2}>Username</Box>
        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Flex>
    )
  }
  return (
    <Flex bg="tan" p={4} ml="auto">
      <Box ml="auto">{body}</Box>
    </Flex>
  )
}

export default Navbar
