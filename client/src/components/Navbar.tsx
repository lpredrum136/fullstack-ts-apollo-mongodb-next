import { Button } from '@chakra-ui/button'
import { Box, Flex, Link } from '@chakra-ui/layout'
import NextLink from 'next/link'

const Navbar = () => {
  const auth = false
  let body = null

  if (!auth) {
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
        <Button variant="link">Logout</Button>
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
