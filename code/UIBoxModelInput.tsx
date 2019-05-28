import * as React from "react";
import styled from "styled-components";
import {
  Frame,
  ControlType,
  addPropertyControls,
  Stack
} from "framer";

export function UIBoxModelInput({ options, label }) {
  const [model, setModel] = React.useReducer(
    (state, action) => {
      return { ...state, ...action };
    },
    { left: null, top: null, bottom: null, right: null }
  );
  return (
    <Frame
      height={56}
      width={56}
      radius={3}
      visible
      overflow="hidden"
      border="1px solid #777777"
      backgroundColor="white"
    >
      <Frame
        id="pinRight"
        right={0}
        visible
        width={9}
        height={55}
        background={model.right ? "#999" : "#BBB"}
        onClick={() => setModel({ right: !model.right })}
      />
      <Frame
        bottom={0}
        width={56 - 9 * 2}
        height={9}
        left={9}
        id="pinBottom"
        visible
        background={model.bottom ? "#999" : "#BBB"}
        onClick={() => setModel({ bottom: !model.bottom })}
      />
      <Frame
        height={9}
        id="pinTop"
        width={56 - 9 * 2}
        left={9}
        visible
        background={model.top ? "#999" : "#BBB"}
        onClick={() => setModel({ top: !model.top })}
      />
      <Frame
        id="pinLeft"
        visible
        width={9}
        height={55}
        background={model.left ? "#999" : "#BBB"}
        onClick={() => setModel({ left: !model.left })}
      />
    </Frame>
  );
}

UIBoxModelInput.defaultProps = {
  width: 56,
  height: 56
};
