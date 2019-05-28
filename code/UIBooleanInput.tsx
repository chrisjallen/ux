import * as React from "react";
import styled from "styled-components";
import {
  Frame,
  ControlType,
  addPropertyControls,
  Stack
} from "framer";

const Text = styled.div`
  all: unset;
  tab-size: 4;
  font-weight: 400;
  font-family: IBMPlexMono-Medium, IBM Plex Mono Medium,
    monospace;
  color: #777777;
  font-size: 10px;
  letter-spacing: 0px;
  line-height: 1.3;
`;

export function UIBooleanInput({
  options,
  label,
  trueText,
  falseText
}) {
  const truncate = text =>
    text.length > 8 ? text.substring(0, 6) + "…" : text;
  return (
    <Stack
      alignment="center"
      border="1px solid #777777"
      direction="horizontal"
      distribute="space-around"
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
      <Text height="76.47058823529412%" visible width={40}>
        {truncate(trueText)}
      </Text>
      <Frame
        background="#999999"
        height={10}
        overflow="visible"
        visible
        width={1}
      />
      <Text height="76.47058823529412%" visible width={40}>
        {truncate(falseText)}
      </Text>
    </Stack>
  );
}

UIBooleanInput.defaultProps = {
  width: 60,
  height: 17,
  type: "booleanInput",
  trueText: "show",
  falseText: "hide"
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
