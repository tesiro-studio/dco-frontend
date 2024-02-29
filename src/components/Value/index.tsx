import { Box, Center } from '@chakra-ui/react';
import { useAnimate } from 'framer-motion';
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer';

interface IValue {
  val: string;
  fontSize?: string;
}

const Value: React.FC<IValue> = ({ val, fontSize = '1.25rem' }) => {
  const [scope, animate] = useAnimate();
  const [state, setState] = useImmer({
    val,
    init: false,
  })

  const handleValue = async (val: string) => {
    const diff = Number(val) - Number(state.val);
    if (diff !== 0) {
      if (diff < 0) {
        setState(s => { s.val = `${diff}` });
        console.log('damage');
        // damage
        await animate(
          scope.current,
          { scale: [1.6, 1.6, 1, 1, 1] },
          { duration: 1 },
        )
      }
      if (diff > 0) {
        setState(s => { s.val = `+${diff}` });
        console.log('heal');
        // heal
        await animate(
          scope.current,
          { scale: [1.6, 1.6, 1, 1, 1] },
          { duration: 1 },
        )
      }
      setState(s => { s.val = val });
    }
  }

  const fillColor = () => {
    if (state.val.startsWith('-')) {
      return '#E82424';
    }
    if (state.val.startsWith('+')) {
      return '#2FD436';
    }
    return 'currentColor';
  }

  useEffect(() => {
    setState(s => { s.init = true });
  }, []);

  useEffect(() => {
    if (state.init) {
      handleValue(val);
    }
  }, [val]);

  return (
    <Center
      ref={scope}
      w={'100%'}
      h={'100%'}
      fontSize={fontSize}
      overflow={'hidden'}
    >
      <Box as='svg'>
        <Box
          as='text'
          x="50%"
          y="50%"
          textAnchor={'middle'}
          dominantBaseline={'central'}
          stroke='black'
          strokeWidth={'4px'}
          paintOrder={'stroke'}
          fill={fillColor()}
        >
          {state.val}
        </Box>
      </Box>
    </Center>
  )
};

export default Value;
