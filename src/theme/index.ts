import { extendTheme } from "@chakra-ui/react";
import Button from "./Button";

const components = {
  Button,
};

export const theme = extendTheme({
  components,
  styles: {
    global: {
      body: {
        fontSize: '16px',
        fontFamily: 'Aladin',
        background: '#000',
        overflow: 'hidden',
      },
    },
  },
  colors: {
    primary: {},
    font: {
      1: '#EED1CD',
      2: '#EED1CD32',
      3: '#87796F',
      4: '#BDA281',
      5: '#441F04',
      6: '#BDAF8D',
      7: '#FFB800',
    },
    button: {
      1: '#F2D7B9',
    },
    border: {
      1: '#C8AF92',
    },
    bg: {
      1: '#FFE500'
    },
    damage: {
      1: '#E82424',
      2: '#FFAC0B'
    },
    heal: {
      1: '#2FD436',
      2: '#3AA9D9'
    },
    desc: {
      1: '#D8BEBB',
    }
  },
  shadows: {
    class: {
      1: 'inset 0px 0px 0rem 0px #C8AF92',
      2: 'inset 0px 0px 3rem 0px #C8AF92'
    },
  }
});
