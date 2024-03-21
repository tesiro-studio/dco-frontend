import { Button, ButtonProps, Center } from '@chakra-ui/react';
import React, { ReactNode } from 'react'

interface IAppButton extends ButtonProps {
  children: ReactNode
}

const AppButton: React.FC<IAppButton> = ({ children, ...props }) => {
  return (
    <Button
      bgRepeat={'no-repeat'}
      bgPos={'center'}
      bgSize={'contain'}
      fontSize={'1.25rem'}
      lineHeight={1.2}
      color={'button.1'}
      _disabled={{
        '.label': {
          opacity: 0.5
        }
      }}
      w={'10rem'}
      h={'3.75rem'}
      {...props}
    >
      <Center className="label">
        {children}
      </Center>
    </Button>
  )
};

export default AppButton;
