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

export function UISliderInput({ rangeMin, rangeMax }) {
  const [range, setRange] = React.useState(rangeMin);
  return (
    <Frame
      background="transparent"
      height={17}
      visible
      width={45}
    >
      <Frame
        background="transparent"
        border="1px solid #222"
        height={10}
        id="id_JEHlFrju8"
        radius={20}
        visible
        width={10}
        drag="x"
        dragConstraints={{ left: 2, right: 40 }}
        dragMomentum={false}
        dragElastic={0}
        onDrag={(e, info) => {
          const perc = info.point.x / 40;
          const range =
            perc * (rangeMax - rangeMin) + rangeMin;
          setRange(Math.floor(range));
        }}
      />
      <Frame
        background="transparent"
        border="1px solid #222"
        height={2}
        id="id_BGUUU5LT7"
        left={5}
        top={4}
        visible
        width={42}
      />
    </Frame>
  );
}

UISliderInput.defaultProps = {
  width: 45,
  height: 17,
  rangeMin: 0,
  rangeMax: 200
};

addPropertyControls(UISliderInput, {
  rangeMin: {
    type: ControlType.Number,
    title: "Range Min"
  },
  rangeMax: {
    type: ControlType.Number,
    title: "Range Min"
  }
});
