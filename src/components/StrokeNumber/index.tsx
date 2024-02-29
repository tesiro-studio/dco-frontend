import React, { useEffect, useState } from 'react'
import { Box, Center } from '@chakra-ui/react';
import { useAnimate } from 'framer-motion';

interface IStrokeNumber {
  color?: string;
  value: string;
  width: string;
  fontSize: string;
}

const StrokeNumber: React.FC<IStrokeNumber> = ({ value, width, fontSize }) => {
  const [scope, animate] = useAnimate();
  const [init, setInit] = useState(false);

  useEffect(() => {
    setInit(true);
  }, []);

  useEffect(() => {
    if (init) {
      animate(scope.current, { color: ['#E82424', '#E82424', '#ffffff'], scale: [1.5, 1.25, 1] });
    }
  }, [value, init]);
  return (
    <Center
      ref={scope}
      width={width}
      h={'100%'}
      fontSize={fontSize}
    >
      <Box as='svg' minW={value.length > 1 ? '150%' : '100%'}>
        <Box
          as='text'
          x="50%"
          y="50%"
          textAnchor={'middle'}
          dominantBaseline={'central'}
          stroke='black'
          strokeWidth={'4px'}
          paintOrder={'stroke'}
          fill={'currentcolor'}
        >
          {value}
        </Box>
      </Box>
    </Center>
  )
};

export default StrokeNumber;
