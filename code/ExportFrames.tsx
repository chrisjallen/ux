import * as React from "react";
import Clipboard from "react-clipboard.js";
import * as reactElementToJSXString from "react-element-to-jsx-string";
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
  parsePercent
} from "./utils";

export function ExportFrames(props) {
  const { content } = props;
  if (!content[0]) return <NoTarget />;
  const exportString = useExport(content);
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
  collapseContainers: false
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
  }
});

const useExport = props => {
  const StackC = <Stack />;
  console.log(StackC);
  console.log("hello there");
  const reactEls = props
    .map(t => composeComponentProps(t, {}, null, StackC))
    .filter(t => t);
  const parsedCodeString = reactElementToJSXString(
    reactEls[0],
    props
  );
  return parsedCodeString;
};

const composeComponentProps = (
  component,
  parent = {},
  variant = null,
  StackC = {}
) => ({
  ...component,
  props: populate({
    ...parseFrameProps(
      component.props,
      parent.props,
      variant
    ),
    children: (component.props.children || [])
      .map(c => composeChildProps(c, component, StackC))
      .filter(t => t)
  })
});

const composeChildProps = (
  component,
  parent = {},
  StackC
) => {
  if (
    component.type.name === "ComponentContainer" &&
    component.props.componentIdentifier === "framer/Stack"
  ) {
    return {
      ...StackC,
      props: populate({
        ...parseStackProps(component.props, parent.props),
        children: (
          component.props.children[0].props.children || []
        )
          .map(c =>
            composeComponentProps(
              c,
              component,
              "stackChild",
              StackC
            )
          )
          .filter(t => t)
      })
    };
  } else {
    return composeComponentProps(component, parent);
  }
};

const parseStackProps = (
  currentProps,
  parentProps = {}
) => {
  const {
    direction = "vertical",
    distribution = "space-around",
    alignment = "center",
    style = {},
    padding,
    gap
  } = currentProps.children[0].props;
  const childProps = currentProps.children[0]
    ? currentProps.children[0].props
    : {};
  return populate({
    ...parseFrameProps(currentProps, parentProps),
    ...parseFrameProps(childProps, currentProps),
    id: currentProps.name || currentProps.id,
    direction,
    distribution,
    overflow: style.overflow,
    padding,
    gap,
    alignment
  });
};

const parseFrameProps = (
  currentProps,
  parentProps = {},
  variant = null
) => {
  const {
    style = {},
    _border = {},
    visible
  } = currentProps;
  let props = select(
    ({
      top,
      bottom,
      left,
      right,
      centerX,
      centerY,
      width,
      height
    }) => {
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
    },
    currentProps
  )(currentProps);

  if (variant === "stackChild") {
    props = {
      ...props,
      x: null,
      y: null,
      top: null,
      bottom: null
    };
  }

  return populate({
    ...props,
    id: currentProps.name || currentProps.id,
    opacity: style.opacity,
    rotate: parseDeg(style.rotate),
    radius: parseRadius(style.borderRadius),
    visible,
    border:
      _border.borderColor &&
      `${Number(_border.borderWidth) || 1}px ${
        _border.borderStyle
      } ${_border.borderColor}`, // todo border per side
    overflow: style.overflow,
    rawHTML: currentProps.rawHTML,
    background: parseBackground(currentProps)
  });
};
