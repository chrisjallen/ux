import * as React from "react";
import styled from "styled-components";
import {
  Frame,
  PropertyControls,
  ControlType,
  FrameProps,
  addPropertyControls,
  Stack
} from "framer";

const Base = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
`;

const NumberInput = styled.input`
  width: ${props => props.width};
  height: ${props => props.height};
  font-size: 9px;
  tab-size: 4;
  font-family: "IBMPlexMono-Medium", "IBM Plex Mono Medium";
  -webkit-text-fill-color: #777777;
  font-size: 10px;
  letter-spacing: 0px;
  line-height: 1.2;
  font-weight: 400;
  color: #777777;
  outline: none;
  border: none;
`;

const TextField = styled(Base)`
  tab-size: 4;
  font-family: "IBMPlexMono-Medium", "IBM Plex Mono Medium";
  -webkit-text-fill-color: #777777;
  font-size: 7px;
  letter-spacing: 0px;
  line-height: 1.5;
  font-weight: 400;
`;

export const UINumberInput = ({ label }) => {
  return (
    <Stack
      alignment="center"
      background="none"
      border="1px solid #000000"
      direction="horizontal"
      distribution="space-around"
      height={17}
      opacity={1}
      overflow="hidden"
      padding={0}
      radius={3}
      rotate={0}
      visible
      width={45}
    >
      <NumberInput
        width="90%"
        height="100%"
        placeholder={0}
        type="number"
        min="0"
        max="100"
        step="5"
      />
      <TextField height="60%" width="18%" id="label">
        {label}
      </TextField>
    </Stack>
  );
};

UINumberInput.defaultProps = {
  width: 45,
  height: 17,
  label: "."
};

addPropertyControls(UINumberInput, {
  circle: { type: ControlType.Boolean, title: "Circle" }
});
