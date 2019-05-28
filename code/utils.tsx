export const noop = function() {};
export const select = (
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

export const populate = obj => {
  const populateObj = {};
  const filteredKeys = Object.keys(obj).filter(
    key => obj[key]
  );
  filteredKeys.forEach(
    key => (populateObj[key] = obj[key])
  );
  return populateObj;
};

export const parseDeg = select(val =>
  isNaN(val) ? Number((val || "").split("deg")[0]) : val
);

export const parsePercent = select(val =>
  Number(val.split("%")[0])
);

export const parsePx = select(val =>
  Number((val || "").split("px")[0])
);

export const parseRadius = select((val = "") => {
  return val.includes("%") ? val : parsePx(val);
});

export const parseBackground = currentProps => {
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
