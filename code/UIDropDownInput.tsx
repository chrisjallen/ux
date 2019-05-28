import * as React from "react";
import styled from "styled-components";
import {
  Frame,
  ControlType,
  addPropertyControls,
  Stack
} from "framer";

const DropdownInput = styled.select`
  all: unset;
  tab-size: 4;
  font-family: "IBMPlexMono-Medium", "IBM Plex Mono Medium";
  font-size: 10px;
  letter-spacing: 0px;
  line-height: 1.2;
  font-weight: 400;
  color: #777777;
  outline: none;
  border: none;
  height: 75%;
  width: 40px;
  padding-left: 5px;
`;

export function UIDropDown({ options, label }) {
  const truncate = text =>
    text.length > 8 ? text.substring(0, 6) + "…" : text;
  return (
    <Stack
      id="dropdown"
      alignment="center"
      border="1px solid #777777"
      direction="horizontal"
      distribution="space-around"
      opacity={1}
      overflow="hidden"
      padding={0}
      radius={3}
      height={17}
      right={null}
      rotate={0}
      visible
      width={60}
    >
      <DropdownInput>
        <option value={label}>{label}</option>
        {options.map(option => (
          <option key={option} value={option}>
            {truncate(option)}
          </option>
        ))}
      </DropdownInput>

      <Frame
        background="hsla(0, 0%, 0%, 0.5)"
        border="1px solid #BBBBBB"
        height={6}
        id="id_NaZN0JlIF"
        overflow="visible"
        visible
        width={5}
        right={3}
        style={{ zIndex: 0 }}
      />
    </Stack>
  );
}

UIDropDown.defaultProps = {
  width: 60,
  height: 17,
  label: "Field",
  type: "dropdown",
  options: []
};

addPropertyControls(UIDropDown, {
  options: {
    type: ControlType.Array,
    propertyControl: {
      type: ControlType.String
    }
  },
  label: {
    type: ControlType.String,
    title: "Label"
  }
});
