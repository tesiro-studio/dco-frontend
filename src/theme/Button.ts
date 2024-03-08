import { defineStyleConfig } from "@chakra-ui/react";
import ButtonBgImg from '@/assets/images/btn_bg.webp';
import ButtonDisabledBgImg from '@/assets/images/btn_bg_disabled.webp';
import cursorHover from '@/assets/icons/cursor-hover.png';

const Button = defineStyleConfig({
  baseStyle: {
    // fontWeight: 600,
    w: 'auto',
    h: 'auto',
    minW: 'auto',
    color: 'font.1',
    cursor: `url('${cursorHover}'), pointer`,
  },
  variants: {
    base: {
      border: '0px solid',
      fontSize: '1.25rem',
      lineHeight: 1.6,
      bgImg: ButtonBgImg,
      _disabled: {
        opacity: 1,
        pointerEvents: 'none',
        bgImg: ButtonDisabledBgImg,
        '.label': {
          opacity: 0.5,
        }
      }
    },
  },
  // The default size and variant values
  defaultProps: {
    // size: 'md',
    variant: 'base',
  },
})

export default Button;
