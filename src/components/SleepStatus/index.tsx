import React from 'react'
import { Box } from '@chakra-ui/react';
import { ChakraText } from '../ChakraBox';

const SleepStatus: React.FC = () => {
  return (
    <Box as="svg" boxSize={'100%'} color={'#4AD582'}>
      <ChakraText
        x="35%"
        y="65%"
        textAnchor={'middle'}
        dominantBaseline={'central'}
        stroke='#062512'
        strokeWidth={'4px'}
        paintOrder={'stroke'}
        fill={'currentcolor'}
        fontSize={'1rem'}
        animate={{
          scale: [0.5, 0.8, 0.8, 0.8, 0.8],
          opacity: [0, 1, 1, 0, 0],
        }}
        // @ts-ignore no problem in operation, although type error appears.
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        Z
      </ChakraText>
      <ChakraText
        x="50%"
        y="50%"
        textAnchor={'middle'}
        dominantBaseline={'central'}
        stroke='#062512'
        strokeWidth={'4px'}
        paintOrder={'stroke'}
        fill={'currentcolor'}
        fontSize={'1rem'}
        animate={{
          scale: [0.75, 1, 1, 1, 1],
          opacity: [0, 1, 1, 0, 0],
        }}
        // @ts-ignore no problem in operation, although type error appears.
        transition={{
          delay: 0.25,
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        Z
      </ChakraText>
      <ChakraText
        x="65%"
        y="35%"
        textAnchor={'middle'}
        dominantBaseline={'central'}
        stroke='#062512'
        strokeWidth={'4px'}
        paintOrder={'stroke'}
        fill={'currentcolor'}
        fontSize={'1rem'}
        animate={{
          scale: [1, 1.2, 1.2, 1.2, 1.2],
          opacity: [0, 1, 1, 0, 0],
        }}
        // @ts-ignore no problem in operation, although type error appears.
        transition={{
          delay: 0.5,
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        Z
      </ChakraText>
    </Box>
  )
};

export default SleepStatus;

