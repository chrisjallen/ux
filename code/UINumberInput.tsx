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
  color: ${props => (props.focus ? "black" : "#777777")};
  font-size: 10px;
  letter-spacing: 0px;
  line-height: 1.2;
  font-weight: 400;
  color: #777777;
  outline: none;
  border: none;
`;

const Text = styled(Base)`
  tab-size: 4;
  font-family: "IBMPlexMono-Medium", "IBM Plex Mono Medium";
  color: ${props => (props.focus ? "black" : "#777777")};
  font-size: 7px;
  letter-spacing: 0px;
  line-height: 1.5;
  font-weight: 400;
`;

export const UINumberInput = ({ label }) => {
  const [focus, setFocus] = React.useState(false);
  const border = focus
    ? "1px solid black"
    : "1px solid #777";
  return (
    <Stack
      alignment="center"
      background="none"
      border={border}
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
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        focus={focus}
      />
      <Text
        height="60%"
        width="18%"
        id="label"
        focus={focus}
      >
        {label}
      </Text>
    </Stack>
  );
};

UINumberInput.defaultProps = {
  width: 45,
  height: 17,
  label: ".",
  type: "number"
};

addPropertyControls(UINumberInput, {
  label: {
    type: ControlType.String,
    title: "Label"
  }
});
