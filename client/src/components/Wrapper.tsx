import { Box } from '@chakra-ui/layout'
import { ReactNode } from 'react'
import Head from 'next/head'

interface IWrapperProps {
  children: ReactNode
  variant?: 'small' | 'regular'
}

const Wrapper = ({ children, variant = 'regular' }: IWrapperProps) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Lireddit</title>
      </Head>

      <main>
        <Box
          maxW={variant === 'regular' ? '800px' : '400px'}
          w="100%"
          mt={8}
          mx="auto"
        >
          {children}
        </Box>
      </main>
    </>
  )
}

export default Wrapper
