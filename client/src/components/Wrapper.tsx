import { Box } from '@chakra-ui/layout'
import { ReactNode } from 'react'

interface IWrapperProps {
  children: ReactNode
  variant?: 'small' | 'regular'
}

const Wrapper = ({ children, variant = 'regular' }: IWrapperProps) => {
  return (
    <Box
      maxW={variant === 'regular' ? '800px' : '400px'}
      w="100%"
      mt={8}
      mx="auto"
    >
      {children}
    </Box>
  )
}

export default Wrapper
