import * as React from "react";
import {
  Frame,
  PropertyControls,
  ControlType,
  FrameProps,
  addPropertyControls
} from "framer";
import * as reactElementToJSXString from "react-element-to-jsx-string";
import Highlight, {
  defaultProps
} from "prism-react-renderer";
import Clipboard from "react-clipboard.js";
import { Stack } from "./Stack";

export const ExportFrames = props => {
  const { content } = props;
  const [
    parsedTargets,
    parsedCodeString
  ] = useFramerConversion(content);
  if (!content[0]) return <NoTarget />;
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
        code={parsedCodeString}
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
        data-clipboard-text={parsedCodeString}
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
      {/* <RenderOldVersion {...props} /> */}
    </div>
  );
};

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
  theme: "nightOwl"
};

addPropertyControls(ExportFrames, {
  content: {
    type: ControlType.ComponentInstance,
    title: "Component"
  }
});

// Utils

const useFramerConversion = inProps => {
  const StackC = <Stack />;
  const composeComponentProps = (
    component,
    parent = {},
    variant = null
  ) => ({
    ...component,
    props: populate({
      ...parseFrameProps(
        component.props,
        parent.props,
        variant
      ),
      children: (component.props.children || [])
        .map(c => composeChildProps(c, component))
        .filter(t => t)
    })
  });
  // second parse, looking for stacks and merging
  const composeChildProps = (component, parent = {}) => {
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
                "stackChild"
              )
            )
            .filter(t => t)
        })
      };
    } else {
      return composeComponentProps(component, parent);
    }
  };
  const parsedTargets = inProps
    .map(t => composeComponentProps(t))
    .filter(t => t);
  const parsedCodeString = reactElementToJSXString(
    parsedTargets[0],
    inProps
  );
  return [parsedTargets, parsedCodeString];
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
  // console.log(currentProps);
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

// Helpers
const noop = function() {};
const select = (
  selector,
  defaultValue = null,
  log = true
) => {
  return (...val) => {
    try {
      return selector(...val);
    } catch (e) {
      if (log) console.log(e);
      return defaultValue;
    }
  };
};
const populate = obj => {
  const populateObj = {};
  const filteredKeys = Object.keys(obj).filter(
    key => obj[key]
  );
  filteredKeys.forEach(
    key => (populateObj[key] = obj[key])
  );
  return populateObj;
};

// Parsers

const parseDeg = select(val =>
  isNaN(val) ? Number((val || "").split("deg")[0]) : val
);

const parsePercent = select(val =>
  Number(val.split("%")[0])
);

const parsePx = select(val =>
  Number((val || "").split("px")[0])
);

const parseRadius = select((val = "") => {
  return val.includes("%") ? val : parsePx(val);
});

const parseBackground = currentProps => {
  let { background } = currentProps;
  const b = background || {
    r: 0,
    b: 100,
    g: 0,
    a: 0.5,
    format: "rgba",
    alpha: 1
  };

  switch (b.fit || b.__class || b.format) {
    case "LinearGradient": {
      return {
        alpha: b.alpha,
        angle: b.angle,
        start: b.start,
        end: b.end
      };
    }
    case "fill": {
      return {
        src: b.src
      };
    }
    case "fit": {
      return {
        src: b.src
      };
    }
    case "stretch": {
      return {
        src: b.src
      };
    }
    default:
      return b.initialValue;
  }
};

//
// const OldVersion = props => {
//   const codeString = reactElementToJSXString(
//     props.content[0],
//     props
//   );
//   if (!props.content[0]) return <NoTarget />;
//   return (
//     <Highlight
//       {...defaultProps}
//       code={codeString}
//       language="jsx"
//     >
//       {({
//         className,
//         style,
//         tokens,
//         getLineProps,
//         getTokenProps
//       }) => (
//         <pre className={className} style={style}>
//           {tokens.map((line, i) => (
//             <div {...getLineProps({ line, key: i })}>
//               {line.map((token, key) => (
//                 <span {...getTokenProps({ token, key })} />
//               ))}
//             </div>
//           ))}
//         </pre>
//       )}
//     </Highlight>
//   );
// };
