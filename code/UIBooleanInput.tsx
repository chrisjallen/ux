import * as React from "react";
import styled from "styled-components";
import {
  Frame,
  ControlType,
  addPropertyControls,
  Stack
} from "framer";

const Text = styled.div`
  tab-size: 4;
  font-weight: 400;
  font-family: IBMPlexMono-Medium,
    IBM Plex Mono Medium monospace;
  font-size: 10px;
  letter-spacing: 0px;
  line-height: 1.3;
  color: ${props => (props.highlight ? "#000" : "#777777")};
  cursor: pointer;
`;

export function UIBooleanInput({
  options,
  label,
  trueText,
  falseText,
  initialValue = true
}) {
  const truncate = text =>
    text.length > 8 ? text.substring(0, 6) + "…" : text;
  const [focus, setFocus] = React.useState(false);
  const border = focus
    ? "1px solid black"
    : "1px solid #777";

  const [isTrue, setTrue] = React.useState(initialValue);
  return (
    <Stack
      alignment="center"
      border={border}
      direction="horizontal"
      distribution="space-around"
      height={17}
      id="TextField"
      opacity={1}
      overflow="hidden"
      padding={0}
      radius={3}
      right={null}
      rotate={0}
      visible
      width={100}
    >
      <Text
        height="76.47058823529412%"
        visible
        width={40}
        highlight={isTrue}
        onClick={() => setTrue(true)}
      >
        {truncate(trueText)}
      </Text>
      <Frame
        background="#999999"
        height={10}
        overflow="visible"
        visible
        width={1}
      />
      <Text
        height="76.47058823529412%"
        visible
        width={40}
        highlight={!isTrue}
        onClick={() => setTrue(false)}
      >
        {truncate(falseText)}
      </Text>
    </Stack>
  );
}

UIBooleanInput.defaultProps = {
  width: 100,
  height: 17,
  type: "booleanInput",
  trueText: "show",
  falseText: "hide",
  initialValue: true
};

addPropertyControls(UIBooleanInput, {
  trueText: {
    type: ControlType.String,
    title: "trueText"
  },
  falseText: {
    type: ControlType.String,
    title: "falseText"
  }
});
