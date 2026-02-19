import { useState } from 'react';
import styled from 'styled-components';
import { MuiColorInput, MuiColorInputValue, MuiColorInputColors } from 'mui-color-input';

import type { EditorToolbarItemProps } from '../types';

// ----------------------------------------------------------------------


const MuiColorInputStyled = styled(MuiColorInput)`
& .MuiColorInput-AlphaSlider {
  margin-top: 10px;
}
`

export function ColorItem({
  // icon,
  // label,
  // active,
  // disabled,
  valueColor,
  editor}: & EditorToolbarItemProps) {

const defultColor = '#000000';

  const [color, setColor] = useState<MuiColorInputValue>(defultColor || valueColor);
  const handleChange = (value: string, _colors: MuiColorInputColors) => {
    setColor(value);
  }

  return (
    <MuiColorInputStyled
      InputProps={{
        style: {
          padding: "9px 0px",
          width: 25,
          height: 25,
          borderRadius: 5

        }
      }}
      format="hex"
      value={color}
      onBlur={() => editor.chain().focus().setColor(color).run()}
      onFocus={() => editor.chain().focus().run()}
      onChange={(value: string, colors: MuiColorInputColors) => handleChange(value, colors)}
    // {...other}
    />
  );
}
