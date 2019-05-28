import * as React from "react";
import Clipboard from "react-clipboard.js";
import * as reactElementToJSXString from "react-element-to-jsx-string";
import { Stack as Stacker } from "./Stack";
import { stateToHTML } from "draft-js-export-html";

import {
  ControlType,
  addPropertyControls,
  Stack
} from "framer";
import Highlight, {
  defaultProps
} from "prism-react-renderer";
import {
  parseBackground,
  parseRadius,
  parseDeg,
  populate,
  select,
  parsePercent,
  cssConvert,
  extractHTMLStyles,
  extractHTMLText
} from "./utils";

export function ExportFrames(props) {
  const { content } = props;
  if (!content || !content[0]) return <NoTarget />;
  const exportString = useExport(content || [], props);
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "scroll",
        padding: "0 16px",
        color: "white"
      }}
    >
      <Highlight
        {...defaultProps}
        code={exportString}
        language="jsx"
      >
        {({
          className,
          style,
          tokens,
          getLineProps,
          getTokenProps
        }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span
                    {...getTokenProps({ token, key })}
                  />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      <Clipboard
        data-clipboard-text={exportString}
        style={{
          cursor: "pointer",
          backgroundColor: "none",
          background: "none",
          border: "none",
          outline: "none",
          color: "#0099ff",
          position: "fixed",
          top: "8px",
          right: "12px"
        }}
      >
        Copy to Clipboard!!
      </Clipboard>
    </div>
  );
}

const NoTarget = () => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#8855FF",
        overflow: "hidden",
        padding: "16px",
        fontSize: 40
      }}
    >
      <span
        style={{ fontSize: "40px", paddingBottom: "8px" }}
      >
        ‍ .{" "}
      </span>
      Choose component
    </div>
  );
};

ExportFrames.defaultProps = {
  target: null,
  tabStop: 2,
  defaultProps: true,
  theme: "nightOwl",
  collapseContainers: false,
  exportOwnVersion: false
};

addPropertyControls(ExportFrames, {
  content: {
    type: ControlType.ComponentInstance,
    title: "Component"
  },
  collapseContainers: {
    type: ControlType.Boolean,
    title: "Collapse Component Containers",
    enabledTitle: "Collapse",
    disabledTitle: "Expose"
  },
  exportOwnVersion: {
    type: ControlType.Boolean,
    title: "Use export version",
    enabledTitle: "Framer Api",
    disabledTitle: "Own Api"
  }
});

const useExport = (
  Component,
  { collapseContainers = false }
) => {
  const reactEls = Component.map(c =>
    composeComponent(c, undefined, collapseContainers)
  ).filter(t => t);
  const parsedCodeString = reactElementToJSXString(
    reactEls[0],
    Component
  );
  return parsedCodeString;
};

const composeComponent = (
  Component = {
    props: { children: [] },
    defaultProps: {}
  },
  Parent = { props: {} },
  collapse = false
) => {
  const children = Component.props.children || [];
  const filtered = children
    .map(child => composeChild(child, Component, collapse))
    .filter(t => t);

  const props = parseFrameProps(
    Component.props,
    Parent.props,
    Component.defaultProps
  );
  const out = {
    ...Component,
    type: {
      ...Component.type,
      name: Component.type.name,
      defaultProps: {},
      defaultComponentContainerProps: {}
    },
    props: populate({
      ...props,
      children: filtered
    })
  };

  return out;
};

const composeChild = (component, parent, collapse) => {
  if (
    component.type.name === "ComponentContainer" &&
    component.props.children &&
    component.props.children[0].props.children &&
    collapse
  ) {
    const Child = {
      ...component.props.children[0]
    };
    Child.props = {
      ...Child.props,
      ...component.defaultProps,
      ...component.props,
      children: Child.props.children
    };
    return composeComponent(Child, parent, collapse);
  } else {
    return composeComponent(component, parent, collapse);
  }
};

const parseFrameProps = (
  currentProps,
  parentProps,
  defaultProps
) => {
  let positionProps = select(() => {
    const {
      top,
      bottom,
      left,
      right,
      centerX,
      centerY,
      width,
      height
    } = currentProps;
    return populate({
      top,
      bottom,
      left,
      right,
      width,
      height,
      y: select(() => {
        if (!top && !bottom && centerY && parentProps) {
          return (
            parentProps.height *
              (parsePercent(centerY) * 0.01) -
            height * 0.5
          );
        }
      })(),
      x: select(() => {
        if (!left && !right && centerX && parentProps) {
          return (
            parentProps.width *
              (parsePercent(centerX) * 0.01) -
            width * 0.5
          );
        }
      })()
    });
  }, {})();

  // if (variant === "stackChild") {
  //   props = {
  //     ...props,
  //     x: null,
  //     y: null,
  //     top: null,
  //     bottom: null
  //   };
  // }
  const styleProps = select(() => {
    const { style = {} } = currentProps;
    return populate({
      opacity: style.opacity,
      overflow: style.overflow,
      rotate: parseDeg(style.rotate),
      radius: parseRadius(style.borderRadius)
    });
  }, {})();

  const border = select(() => {
    const _border = currentProps;
    return (
      _border.borderColor &&
      `${Number(_border.borderWidth) || 1}px ${
        _border.borderStyle
      } ${_border.borderColor}`
    ); // todo border per side
  })();

  const background = parseBackground(
    currentProps.background
  );

  const defaults = select(() => {
    const {
      componentIdentifier = null,
      key = null,
      style = null,
      ...rest
    } = defaultProps || {};
    return rest;
  }, {})();

  const rawTextProps = select(() => {
    const textProps = {
      rawCss: extractHTMLStyles(currentProps.rawHTML || ""),
      inner: extractHTMLText(currentProps.rawHTML || "")
    };
    // console.log(textProps.inner);
    return textProps;
  }, {})();

  const props = populate({
    ...defaults,
    ...positionProps,
    ...styleProps,
    ...rawTextProps,
    border,
    background
  });

  return {
    id: currentProps.name || currentProps.id,
    ...props
    // css: cssConvert(props)
  };
};

// Parsers

// const parseStackProps = (
//   currentProps,
//   parentProps = {}
// ) => {
//   const {
//     direction = "vertical",
//     distribution = "space-around",
//     alignment = "center",
//     style = {},
//     padding,
//     gap
//   } = currentProps.children[0].props;
//   const childProps = currentProps.children[0]
//     ? currentProps.children[0].props
//     : {};
//   return populate({
//     ...parseFrameProps(currentProps, parentProps),
//     ...parseFrameProps(childProps, currentProps),
//     id: currentProps.name || currentProps.id,
//     direction,
//     distribution,
//     overflow: style.overflow,
//     padding,
//     gap,
//     alignment
//   });
// };
