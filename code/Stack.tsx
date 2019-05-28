import * as React from "react";
import { Frame } from "framer";

export function Stack(props) {
  return <Frame {...props} />;
}

const FrameProps = {
  top: null,
  bottom: null,
  left: null,
  right: null,
  width: 200,
  height: 400,
  opacity: 100,
  rotate: 0,
  radius: 0,
  visible: true,
  border: 0,
  overflow: "hidden",
  background: "red",
  style: { display: "flex", flexDirection: "column", justifyContent: "center" }
};

Stack.defaultProps = {
  ...FrameProps,
  direction: "column",
  distribute: "space-around",
  alignment: "center",
  padding: 0
};
