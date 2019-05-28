import * as React from "react";
import {
  Frame,
  PropertyControls,
  ControlType,
  FrameProps,
  addPropertyControls
} from "framer";
import { Stack } from "./Stack";

export const UINumberInput = ({}) => {
  return (
    <Stack
      alignment="center"
      background="red"
      border="1px solid #000000"
      bottom={null}
      direction="horizontal"
      distribute="space-around"
      distribution="space-around"
      height={17}
      id="UI-TextField"
      left={null}
      opacity={1}
      overflow="hidden"
      padding={0}
      radius={3}
      right={null}
      rotate={0}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
      top={null}
      visible
      width={39}
    >
      <Text
        height="76.47058823529412%"
        id="input"
        rawHTML='<div class=&apos;DraftEditor-alignLeft&apos;><div data-offset-key="bgvs8-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="bgvs8-0-0" style="tab-size:4;font-family:"IBMPlexMono-Medium", "IBM Plex Mono Medium", monospace;-webkit-text-fill-color:#777777;font-size:10px;letter-spacing:0px;line-height:1.2;font-weight:400"><span data-text="true">100</span></span></div></div>'
        visible
        width="48.717948717948715%"
      />
      {/* <Text
        height="70.58823529411765%"
        id="label"
        rawHTML='<div class=&apos;DraftEditor-alignRight&apos;><div data-offset-key="1ceuu-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="1ceuu-0-0" style="tab-size:4;font-family:"IBMPlexMono-Medium", "IBM Plex Mono Medium", monospace;-webkit-text-fill-color:#777777;font-size:7px;letter-spacing:0px;line-height:1;font-weight:400"><span data-text="true">F</span></span></div></div>'
        visible
        width="23.076923076923077%"
      /> */}
    </Stack>
  );
};

UINumberInput.defaultProps = {
  width: 39,
  height: 17,
  label: "Number input",
  type: "default"
};

const Text = ({ height, id, rawHTML, width, visible }) => {
  return (
    <input
      type="text"
      height={height}
      id={id}
      width={width}
      disabled={visible}
      value="whammy"
    />
  );
};

// interface Props {
//   label: string;
//   type: "default" | "primary" | "danger" | "ghost" | "dashed";
//   size: "default" | "small" | "large";
//   icon: string;
//   disabled: boolean;
//   ghost: boolean;
//   circle: boolean;
//   onClick: React.MouseEventHandler;
// }

// export class AntButton extends React.Component<Props> {
//   // Set default properties
//   static defaultProps = {
//     width: 68,
//     height: 32,
//     label: "Label",
//     type: "default",
//     size: "default",
//     icon: "",
//     disabled: false,
//     ghost: false,
//     circle: false,
//     onClick: () => {}
//   };

//   // Items shown in property panel
//   static propertyControls: PropertyControls = {
//     label: { type: ControlType.String, title: "Label" },
//     icon: { type: ControlType.String, title: "Icon" },
//     type: {
//       type: ControlType.Enum,
//       options: ["default", "primary", "danger", "ghost", "dashed"],
//       title: "Type"
//     },
//     size: {
//       type: ControlType.SegmentedEnum,
//       options: ["default", "small", "large"],
//       title: "Size"
//     },
//     circle: { type: ControlType.Boolean, title: "Circle" },
//     disabled: { type: ControlType.Boolean, title: "Disabled" },
//     ghost: { type: ControlType.Boolean, title: "Ghost" }
//   };

//   render() {
//     const { label, type, size, icon, disabled, ghost, circle, onClick } = {
//       ...this.props
//     };
//     const labeledButton = (
//       <Button
//         type={type}
//         size={size}
//         icon={icon}
//         disabled={disabled}
//         ghost={ghost}
//         onClick={onClick}
//         block={true}
//       >
//         {label}
//       </Button>
//     );
//     const circledButton = (
//       <Button
//         type={type}
//         size={size}
//         icon={icon}
//         disabled={disabled}
//         ghost={ghost}
//         onClick={onClick}
//         shape="circle"
//       />
//     );

//     return circle ? circledButton : labeledButton;
//   }
// }
