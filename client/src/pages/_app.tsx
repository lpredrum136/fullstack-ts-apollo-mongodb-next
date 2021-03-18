import { ChakraProvider } from '@chakra-ui/react'

import theme from '../theme'
import { AppProps } from 'next/app'
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

// https://www.apollographql.com/docs/react/networking/authentication/#header

const httpLink = createHttpLink({ uri: 'http://localhost:4000/graphql' })

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessToken = localStorage.getItem('lireddit-accessToken')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default MyApp
