/* @ds-bundle: {"format":4,"namespace":"LeoDesignSystem_a92d8b","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"GoogleSignIn","sourcePath":"components/forms/Input.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"Wordmark","sourcePath":"components/navigation/Nav.jsx"},{"name":"Nav","sourcePath":"components/navigation/Nav.jsx"},{"name":"DepositCTA","sourcePath":"components/product/DepositCTA.jsx"},{"name":"EmergencyStory","sourcePath":"components/product/EmergencyStory.jsx"},{"name":"ParentVoiceCard","sourcePath":"components/product/ParentVoiceCard.jsx"},{"name":"PledgeInterstitial","sourcePath":"components/product/PledgeInterstitial.jsx"},{"name":"PricingCard","sourcePath":"components/product/PricingCard.jsx"},{"name":"TaskPicker","sourcePath":"components/product/TaskPicker.jsx"},{"name":"TrustBar","sourcePath":"components/product/TrustBar.jsx"},{"name":"WhatsAppQuoteCard","sourcePath":"components/product/WhatsAppQuoteCard.jsx"},{"name":"WhatsAppShowcase","sourcePath":"components/product/WhatsAppShowcase.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"da5227ab5273","components/core/Button.jsx":"2fcce1563333","components/core/Card.jsx":"63ed31cee00d","components/core/Icon.jsx":"e3260f59931a","components/forms/Input.jsx":"4811300b89cc","components/navigation/Footer.jsx":"d9063f1b533f","components/navigation/Nav.jsx":"7c76c0b36837","components/product/DepositCTA.jsx":"1355971c56a3","components/product/EmergencyStory.jsx":"eed346900dee","components/product/ParentVoiceCard.jsx":"ea922317fc45","components/product/PledgeInterstitial.jsx":"be1d4588f30b","components/product/PricingCard.jsx":"787e93627470","components/product/TaskPicker.jsx":"25e8085af166","components/product/TrustBar.jsx":"edd1696b656b","components/product/WhatsAppQuoteCard.jsx":"3cf9b19d413c","components/product/WhatsAppShowcase.jsx":"8ba4be09a371","ui_kits/landing/LandingPage.jsx":"bc07aa684eb6"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LeoDesignSystem_a92d8b = window.LeoDesignSystem_a92d8b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Leo badge / pill — eyebrows, status, trust chips. */
function Badge({
  children,
  tone = "neutral",
  icon,
  style,
  ...rest
}) {
  const tones = {
    neutral: {
      background: "var(--bg-inset)",
      color: "var(--text-body)",
      border: "1px solid var(--border)"
    },
    brand: {
      background: "var(--brand-soft)",
      color: "var(--brand)",
      border: "1px solid transparent"
    },
    accent: {
      background: "var(--accent-soft)",
      color: "var(--accent-strong)",
      border: "1px solid transparent"
    },
    success: {
      background: "rgba(42,107,79,0.12)",
      color: "var(--success)",
      border: "1px solid transparent"
    },
    solid: {
      background: "var(--brand)",
      color: "var(--text-on-brand)",
      border: "1px solid transparent"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "5px 12px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "0.02em",
      borderRadius: "var(--radius-pill)",
      lineHeight: 1.4,
      ...tones[tone],
      ...style
    }
  }, rest), icon, children);
}

/** All-caps tracked eyebrow label — sits above section titles. */
function Eyebrow({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-wide)",
      textTransform: "uppercase",
      color: "var(--accent-strong)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 1,
      background: "var(--accent)"
    },
    "aria-hidden": "true"
  }), children);
}
Object.assign(__ds_scope, { Badge, Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Leo Button — primary (forest), secondary (outline), quiet (text).
 * Human labels only ("Give Leo your first task — free"), never "Submit".
 */
function Button({
  variant = "primary",
  size = "md",
  full = false,
  icon = null,
  iconRight = null,
  as = "button",
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "10px 16px",
      fontSize: "var(--text-sm)",
      minHeight: 40
    },
    md: {
      padding: "13px 22px",
      fontSize: "var(--text-base)",
      minHeight: 48
    },
    lg: {
      padding: "16px 28px",
      fontSize: "var(--text-md)",
      minHeight: 56
    }
  };
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontFamily: "var(--font-sans)",
    fontWeight: "var(--weight-semibold)",
    lineHeight: 1,
    letterSpacing: "0.005em",
    borderRadius: "var(--radius-md)",
    border: "1px solid transparent",
    cursor: "pointer",
    width: full ? "100%" : "auto",
    transition: "background var(--dur-fast) var(--ease-calm), color var(--dur-fast) var(--ease-calm), transform var(--dur-fast) var(--ease-calm), box-shadow var(--dur-fast) var(--ease-calm), border-color var(--dur-fast) var(--ease-calm)",
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: "var(--brand)",
      color: "var(--text-on-brand)",
      boxShadow: "var(--shadow-brand)"
    },
    secondary: {
      background: "transparent",
      color: "var(--brand)",
      borderColor: "var(--border-strong)"
    },
    quiet: {
      background: "transparent",
      color: "var(--text-body)",
      padding: size === "lg" ? "16px 12px" : size === "sm" ? "10px 8px" : "13px 10px"
    },
    accent: {
      background: "var(--accent)",
      color: "var(--text-on-accent)",
      boxShadow: "var(--shadow-2)"
    }
  };
  const El = as;
  return /*#__PURE__*/React.createElement(El, _extends({
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    onMouseEnter: e => {
      const t = e.currentTarget;
      if (rest.disabled) return;
      t.style.transform = "var(--lift)";
      if (variant === "primary") t.style.background = "var(--brand-hover)";
      if (variant === "secondary") {
        t.style.background = "var(--brand-soft)";
        t.style.borderColor = "var(--brand)";
      }
      if (variant === "quiet") t.style.color = "var(--brand)";
      if (variant === "accent") t.style.background = "var(--accent-strong)";
    },
    onMouseLeave: e => {
      const t = e.currentTarget;
      t.style.transform = "none";
      t.style.background = variants[variant].background;
      t.style.color = variants[variant].color;
      if (variant === "secondary") t.style.borderColor = "var(--border-strong)";
    }
  }, rest), icon, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Leo surface card — soft warm shadow, generous radius. Optionally hairline-only. */
function Card({
  children,
  padded = true,
  hover = false,
  tone = "default",
  style,
  ...rest
}) {
  const tones = {
    default: {
      background: "var(--surface-card)",
      border: "1px solid var(--border)"
    },
    inset: {
      background: "var(--bg-inset)",
      border: "1px solid var(--border)"
    },
    brand: {
      background: "var(--surface-brand)",
      border: "1px solid transparent",
      color: "var(--text-on-brand)"
    },
    outline: {
      background: "transparent",
      border: "1px solid var(--border-strong)"
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderRadius: "var(--radius-lg)",
      boxShadow: tone === "outline" ? "none" : "var(--shadow-2)",
      padding: padded ? "var(--space-5)" : 0,
      transition: "transform var(--dur-base) var(--ease-calm), box-shadow var(--dur-base) var(--ease-calm)",
      ...tones[tone],
      ...style
    },
    onMouseEnter: hover ? e => {
      e.currentTarget.style.transform = "var(--lift)";
      e.currentTarget.style.boxShadow = "var(--shadow-3)";
    } : undefined,
    onMouseLeave: hover ? e => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "var(--shadow-2)";
    } : undefined
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Leo line-icon set. Lucide-derived geometry: 24×24, currentColor stroke,
 * round caps/joins, no fill. One consistent stroke weight across the brand.
 */
const PATHS = {
  "arrow-right": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 5 19 12 12 19"
  })),
  "arrow-up-right": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "7",
    y1: "17",
    x2: "17",
    y2: "7"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "7 7 17 7 17 17"
  })),
  "chevron-right": /*#__PURE__*/React.createElement("polyline", {
    points: "9 6 15 12 9 18"
  }),
  check: /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }),
  "check-circle": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "8.5 12 11 14.5 15.5 9.5"
  })),
  shield: /*#__PURE__*/React.createElement("path", {
    d: "M12 2l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V5z"
  }),
  "shield-check": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 2l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V5z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "9 11.5 11 13.5 15 9.5"
  })),
  home: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polyline", {
    points: "3 10.5 12 3 21 10.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 9.5V20h14V9.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 20v-5h4v5"
  })),
  gift: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "8",
    width: "18",
    height: "4",
    rx: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "8",
    x2: "12",
    y2: "21"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8S10.6 4 8.2 4a2 2 0 1 0 0 4H12z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8s1.4-4 3.8-4a2 2 0 1 1 0 4H12z"
  })),
  "file-text": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "14 2 14 8 20 8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "13",
    x2: "16",
    y2: "13"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "17",
    x2: "16",
    y2: "17"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "9",
    x2: "10",
    y2: "9"
  })),
  wallet: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 6v12c0 1.1.9 2 2 2h14v-4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 12a2 2 0 0 0 0 4h4v-4z"
  })),
  "heart-pulse": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 20.5S5 16.5 2.8 12C.8 8.3 2.4 4.8 5.7 4.8c2 0 3.4 1.4 4.3 2.9.9-1.5 2.3-2.9 4.3-2.9 3.3 0 4.9 3.5 2.9 7.2"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "21.5 12 16.5 12 14.5 8.5 11.5 16 9.5 12 7 12"
  })),
  phone: /*#__PURE__*/React.createElement("path", {
    d: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z"
  }),
  "message-circle": /*#__PURE__*/React.createElement("path", {
    d: "M7.9 20A9 9 0 1 0 4 16.1L2.5 21.5z"
  }),
  mic: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 10v2a7 7 0 0 1-14 0v-2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "19",
    x2: "12",
    y2: "22"
  })),
  play: /*#__PURE__*/React.createElement("polygon", {
    points: "7 4 20 12 7 20"
  }),
  star: /*#__PURE__*/React.createElement("path", {
    d: "M12 2.5l2.9 6.1 6.6.6-5 4.4 1.5 6.5L12 17.2 6 20.6l1.5-6.5-5-4.4 6.6-.6z"
  }),
  lock: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "4.5",
    y: "11",
    width: "15",
    height: "10",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 11V7a4 4 0 0 1 8 0v4"
  })),
  "user-check": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "7",
    r: "4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "16 11 18 13 22 9"
  })),
  camera: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "13",
    r: "3.5"
  })),
  clock: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 7 12 12 15 14"
  })),
  menu: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "6",
    x2: "21",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "12",
    x2: "21",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "18",
    x2: "21",
    y2: "18"
  })),
  x: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  })),
  "map-pin": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3"
  })),
  sunrise: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 2v6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m4.9 10.9 1.4 1.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 18h2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 18h2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m17.7 12.3 1.4-1.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 22H2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 18a4 4 0 0 0-8 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m8 6 4-4 4 4"
  }))
};
function Icon({
  name,
  size = 22,
  strokeWidth = 1.75,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: "block",
      flexShrink: 0,
      ...style
    },
    "aria-hidden": "true"
  }, rest), PATHS[name] || null);
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Leo text field — warm, generous, calm focus ring. */
function Input({
  label,
  hint,
  error,
  icon,
  id,
  style,
  ...rest
}) {
  const inputId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-medium)",
      color: "var(--text-body)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 14,
      display: "flex",
      color: "var(--text-muted)"
    }
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    style: {
      width: "100%",
      minHeight: 48,
      padding: icon ? "12px 16px 12px 42px" : "12px 16px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      color: "var(--text-strong)",
      background: "var(--surface-card)",
      border: `1px solid ${error ? "var(--danger)" : "var(--border-strong)"}`,
      borderRadius: "var(--radius-md)",
      outline: "none",
      transition: "border-color var(--dur-fast) var(--ease-calm), box-shadow var(--dur-fast) var(--ease-calm)",
      ...style
    },
    onFocus: e => {
      e.currentTarget.style.borderColor = "var(--brand)";
      e.currentTarget.style.boxShadow = "0 0 0 4px var(--ring)";
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = error ? "var(--danger)" : "var(--border-strong)";
      e.currentTarget.style.boxShadow = "none";
    }
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: error ? "var(--danger)" : "var(--text-muted)"
    }
  }, error || hint));
}

/** Google One-Tap style sign-in button — familiar, trustworthy, not loud. */
function GoogleSignIn({
  email = "aditya@gmail.com",
  name = "Aditya Rao",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      minHeight: 56,
      padding: "10px 16px",
      background: "var(--surface-card)",
      border: "1px solid var(--border-strong)",
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      textAlign: "left",
      fontFamily: "var(--font-sans)",
      boxShadow: "var(--shadow-1)",
      transition: "box-shadow var(--dur-fast) var(--ease-calm), transform var(--dur-fast) var(--ease-calm)",
      ...style
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = "var(--shadow-2)";
      e.currentTarget.style.transform = "var(--lift)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = "var(--shadow-1)";
      e.currentTarget.style.transform = "none";
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 48 48",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#4285F4",
    d: "M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#34A853",
    d: "M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FBBC05",
    d: "M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#EA4335",
    d: "M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      lineHeight: 1.3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-strong)"
    }
  }, "Continue as ", name.split(" ")[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--text-muted)"
    }
  }, email)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontSize: "var(--text-xs)",
      color: "var(--text-muted)"
    }
  }, "Google"));
}
Object.assign(__ds_scope, { Input, GoogleSignIn });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Nav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Leo wordmark — typographic (no supplied logo). Display serif + a burnished gold point. */
function Wordmark({
  size = 26,
  dark = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: "var(--font-display)",
      fontSize: size,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: dark ? "var(--ivory)" : "var(--text-strong)",
      display: "inline-flex",
      alignItems: "baseline",
      lineHeight: 1,
      ...style
    }
  }, rest), "Leo", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)",
      marginLeft: 1
    }
  }, "."));
}

/** Minimal top nav — wordmark on the left, one CTA on the right. Nothing else competes. */
function Nav({
  cta = "Give Leo your first task",
  onCta,
  dark = false,
  sticky = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      position: sticky ? "sticky" : "relative",
      top: 0,
      zIndex: 50,
      background: dark ? "rgba(12,31,24,0.72)" : "rgba(246,241,231,0.72)",
      backdropFilter: "saturate(1.4) blur(14px)",
      WebkitBackdropFilter: "saturate(1.4) blur(14px)",
      borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.10)" : "var(--border)"}`,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "14px var(--gutter)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    dark: dark
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onCta,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      minHeight: 44,
      padding: "10px 18px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-on-brand)",
      background: "var(--brand)",
      border: "none",
      borderRadius: "var(--radius-pill)",
      cursor: "pointer",
      boxShadow: "var(--shadow-1)",
      transition: "background var(--dur-fast) var(--ease-calm), transform var(--dur-fast) var(--ease-calm)"
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = "var(--brand-hover)";
      e.currentTarget.style.transform = "var(--lift)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = "var(--brand)";
      e.currentTarget.style.transform = "none";
    }
  }, cta)));
}
Object.assign(__ds_scope, { Wordmark, Nav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Nav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Leo footer — quiet, warm, legal links required (Terms, Privacy, Refund Policy, Contact). */
function Footer({
  style,
  ...rest
}) {
  const cols = [{
    head: "Leo",
    links: ["How it works", "Pricing", "For your parents", "Our associates"]
  }, {
    head: "Company",
    links: ["Our story", "Careers", "Press", "Contact"]
  }, {
    head: "Legal",
    links: ["Terms", "Privacy", "Refund Policy", "Data & security"]
  }];
  const link = {
    color: "var(--text-muted)",
    fontSize: "var(--text-sm)",
    textDecoration: "none",
    transition: "color var(--dur-fast) var(--ease-calm)"
  };
  return /*#__PURE__*/React.createElement("footer", _extends({
    style: {
      background: "var(--forest-950)",
      color: "#CBD4CB",
      padding: "var(--space-8) var(--gutter) var(--space-6)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-7)",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 300
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    dark: true,
    size: 30
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 14,
      fontSize: "var(--text-sm)",
      lineHeight: 1.6,
      color: "#9AA79E"
    }
  }, "Your family's presence in India. A calm, capable friend who happens to have world-class technology.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-7)"
    }
  }, cols.map(c => /*#__PURE__*/React.createElement("nav", {
    key: c.head,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      minWidth: 130
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-wide)",
      textTransform: "uppercase",
      color: "var(--accent-strong)"
    }
  }, c.head), c.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: link,
    onMouseEnter: e => e.currentTarget.style.color = "#F3EEE2",
    onMouseLeave: e => e.currentTarget.style.color = "var(--text-muted)"
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-7)",
      paddingTop: "var(--space-5)",
      borderTop: "1px solid rgba(255,255,255,0.10)",
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "#7C8A80"
    }
  }, "\xA9 ", new Date().getFullYear(), " Leo Family Concierge, Inc. Serving families across the US, Canada & UK."), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "#7C8A80"
    }
  }, "Made with care, 12,000 km apart."))));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/product/DepositCTA.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** "Reserve your family's spot" — a deposit CTA that feels like joining, not checking out. */
function DepositCTA({
  city = "New Jersey",
  spots = 40,
  taken = 31,
  onReserve,
  style,
  ...rest
}) {
  const pct = Math.round(taken / spots * 100);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-xl)",
      padding: "var(--space-6)",
      boxShadow: "var(--shadow-3)",
      maxWidth: 520,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontSize: "var(--text-xs)",
      fontWeight: 600,
      letterSpacing: "var(--tracking-wide)",
      textTransform: "uppercase",
      color: "var(--accent-strong)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "map-pin",
    size: 14
  }), " ", city, " batch \xB7 Spring 2026"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "var(--text-2xl)",
      margin: "12px 0 8px"
    }
  }, "Reserve your family's spot"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-md)",
      color: "var(--text-body)",
      marginBottom: 20
    }
  }, "We open one city at a time so every family gets an associate who knows them by name. Hold your place \u2014 no card today."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 6,
      display: "flex",
      justifyContent: "space-between",
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--text-strong)"
    }
  }, taken), " of ", spots, " families reserved"), /*#__PURE__*/React.createElement("span", null, spots - taken, " left")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      borderRadius: 999,
      background: "var(--bg-inset)",
      overflow: "hidden",
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: "100%",
      background: "linear-gradient(90deg, var(--forest-600), var(--forest-500))",
      borderRadius: 999
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onReserve,
    style: {
      width: "100%",
      minHeight: 56,
      borderRadius: "var(--radius-md)",
      border: "none",
      cursor: "pointer",
      background: "var(--brand)",
      color: "var(--ivory)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-md)",
      fontWeight: 600,
      boxShadow: "var(--shadow-brand)",
      transition: "all var(--dur-fast) var(--ease-calm)"
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = "var(--brand-hover)";
      e.currentTarget.style.transform = "var(--lift)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = "var(--brand)";
      e.currentTarget.style.transform = "none";
    }
  }, "Reserve your family's spot"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      fontSize: "var(--text-xs)",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "lock",
    size: 13
  }), " No payment now \xB7 Fully refundable, always"));
}
Object.assign(__ds_scope, { DepositCTA });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/DepositCTA.jsx", error: String((e && e.message) || e) }); }

// components/product/ParentVoiceCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Parent-voice testimonial in Hinglish with translation. Dignified, never cute. */
function ParentVoiceCard({
  hinglish,
  translation,
  name,
  relation = "Father, Pune",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--forest-800)",
      color: "var(--ivory)",
      borderRadius: "var(--radius-xl)",
      padding: "var(--space-6)",
      boxShadow: "var(--shadow-3)",
      position: "relative",
      overflow: "hidden",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      top: -18,
      left: 20,
      fontFamily: "var(--font-display)",
      fontSize: 130,
      color: "rgba(224,190,132,0.16)",
      lineHeight: 1
    }
  }, "\u201C"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-xl)",
      fontStyle: "italic",
      lineHeight: 1.4,
      color: "#fff",
      margin: "0 0 12px"
    }
  }, hinglish), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-base)",
      color: "rgba(255,255,255,0.72)",
      lineHeight: 1.5,
      margin: "0 0 20px"
    }
  }, translation), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      paddingTop: 16,
      borderTop: "1px solid rgba(255,255,255,0.14)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 42,
      height: 42,
      borderRadius: "50%",
      background: "var(--gold-500)",
      color: "var(--forest-950)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 18
    }
  }, name ? name[0] : "?"), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.35
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: "var(--text-base)"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--gold-300)"
    }
  }, relation)))));
}
Object.assign(__ds_scope, { ParentVoiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/ParentVoiceCard.jsx", error: String((e && e.message) || e) }); }

// components/product/PledgeInterstitial.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** The pledge interstitial — exclusive, warm, not evasive. Shown after "Reserve". */
function PledgeInterstitial({
  city = "New Jersey",
  onConfirm,
  onBack,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      maxWidth: 460,
      margin: "0 auto",
      background: "var(--surface-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-xl)",
      padding: "var(--space-7) var(--space-6) var(--space-6)",
      boxShadow: "var(--shadow-3)",
      textAlign: "center",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 56,
      height: 56,
      borderRadius: "50%",
      background: "var(--accent-soft)",
      color: "var(--accent-strong)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "shield-check",
    size: 28
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "var(--text-2xl)",
      marginBottom: 12
    }
  }, "You're on the ", city, " list"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-md)",
      color: "var(--text-body)",
      lineHeight: 1.6,
      marginBottom: 24
    }
  }, "No card today. When your city batch is confirmed, we'll send a private payment link \u2014 and only then. It's ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--text-strong)"
    }
  }, "fully refundable, always"), ". We'd rather earn the first month than lock you in."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      textAlign: "left"
    }
  }, ["We introduce your associate — by name and photo — before your first task.", "You approve anything before money is spent.", "Leave whenever you like. Your parents keep their dignity either way."].map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: "flex",
      gap: 11,
      alignItems: "flex-start",
      fontSize: "var(--text-sm)",
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check-circle",
    size: 18,
    style: {
      color: "var(--brand)",
      marginTop: 1,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", null, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.GoogleSignIn, null)), /*#__PURE__*/React.createElement("button", {
    onClick: onConfirm,
    style: {
      width: "100%",
      minHeight: 48,
      marginTop: 12,
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--border-strong)",
      background: "transparent",
      color: "var(--brand)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      fontWeight: 600,
      cursor: "pointer"
    }
  }, "Use a different email"), /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      marginTop: 14,
      background: "none",
      border: "none",
      color: "var(--text-muted)",
      fontSize: "var(--text-sm)",
      cursor: "pointer",
      fontFamily: "var(--font-sans)"
    }
  }, "\u2190 Not yet"));
}
Object.assign(__ds_scope, { PledgeInterstitial });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/PledgeInterstitial.jsx", error: String((e && e.message) || e) }); }

// components/product/PricingCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Pricing — monthly + annual side by side, annual highlighted, refund promise inline. */
function PricingCard({
  onChoose,
  style,
  ...rest
}) {
  const plans = [{
    id: "monthly",
    name: "Monthly",
    price: "$69",
    per: "/month",
    sub: "Cancel anytime. No lock-in.",
    features: ["Unlimited everyday tasks", "One dedicated associate", "Voice-note updates", "Every task closed with proof"],
    highlight: false
  }, {
    id: "annual",
    name: "Annual",
    price: "$590",
    per: "/year",
    sub: "Two months on us — $49/mo.",
    features: ["Everything in Monthly", "Priority on emergencies", "Quarterly parent well-being call", "Locked price for life"],
    highlight: true
  }];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "grid",
      gap: 16,
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      ...style
    }
  }, rest), plans.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      position: "relative",
      background: p.highlight ? "var(--forest-700)" : "var(--surface-card)",
      color: p.highlight ? "var(--ivory)" : "var(--text-body)",
      border: p.highlight ? "1.5px solid var(--forest-700)" : "1px solid var(--border)",
      borderRadius: "var(--radius-xl)",
      padding: "var(--space-6) var(--space-5) var(--space-5)",
      boxShadow: p.highlight ? "var(--shadow-brand)" : "var(--shadow-2)"
    }
  }, p.highlight && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 16,
      right: 16,
      fontSize: "var(--text-xs)",
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--forest-950)",
      background: "var(--gold-400)",
      padding: "4px 11px",
      borderRadius: 999
    }
  }, "Best value"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: 600,
      letterSpacing: "var(--tracking-wide)",
      textTransform: "uppercase",
      color: p.highlight ? "var(--gold-300)" : "var(--accent-strong)"
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: "flex",
      alignItems: "baseline",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 46,
      fontWeight: 600,
      color: p.highlight ? "#fff" : "var(--text-strong)",
      lineHeight: 1
    }
  }, p.price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-md)",
      color: p.highlight ? "rgba(255,255,255,0.7)" : "var(--text-muted)"
    }
  }, p.per)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: "var(--text-sm)",
      color: p.highlight ? "var(--gold-300)" : "var(--brand)",
      fontWeight: 500
    }
  }, p.sub), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: "20px 0",
      display: "flex",
      flexDirection: "column",
      gap: 11
    }
  }, p.features.map(f => /*#__PURE__*/React.createElement("li", {
    key: f,
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      fontSize: "var(--text-sm)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check-circle",
    size: 18,
    style: {
      marginTop: 1,
      color: p.highlight ? "var(--gold-300)" : "var(--brand)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: p.highlight ? "rgba(255,255,255,0.92)" : "var(--text-body)"
    }
  }, f)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => onChoose && onChoose(p.id),
    style: {
      width: "100%",
      minHeight: 50,
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      fontWeight: 600,
      border: p.highlight ? "none" : "1px solid var(--border-strong)",
      background: p.highlight ? "var(--gold-400)" : "transparent",
      color: p.highlight ? "var(--forest-950)" : "var(--brand)",
      transition: "all var(--dur-fast) var(--ease-calm)"
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = "var(--lift)";
      if (p.highlight) e.currentTarget.style.background = "var(--gold-300)";else e.currentTarget.style.background = "var(--brand-soft)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "none";
      if (p.highlight) e.currentTarget.style.background = "var(--gold-400)";else e.currentTarget.style.background = "transparent";
    }
  }, "Reserve at ", p.price, p.per), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      fontSize: "var(--text-xs)",
      color: p.highlight ? "rgba(255,255,255,0.72)" : "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "shield-check",
    size: 14
  }), "30-day full refund. No questions, ever."))));
}
Object.assign(__ds_scope, { PricingCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/PricingCard.jsx", error: String((e && e.message) || e) }); }

// components/product/TaskPicker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const DEFAULT_TASKS = [{
  id: "doctor",
  icon: "heart-pulse",
  label: "Book a doctor visit",
  note: "We call, book, and go with them."
}, {
  id: "bill",
  icon: "file-text",
  label: "Handle a bill or document",
  note: "Utilities, KYC, paperwork — closed with proof."
}, {
  id: "property",
  icon: "home",
  label: "Check on our property",
  note: "A visit, photos, and an honest report."
}, {
  id: "gift",
  icon: "gift",
  label: "Send a gift",
  note: "Sweets on the doorstep for the occasion."
}, {
  id: "epf",
  icon: "wallet",
  label: "Recover my stuck EPF",
  note: "The frustrating stuff, handled end to end."
}];

/** Task-picker — 5 selectable cards, single-select. The soft "what would you hand off first?" moment. */
function TaskPicker({
  tasks = DEFAULT_TASKS,
  value,
  defaultValue,
  onChange,
  style,
  ...rest
}) {
  const [internal, setInternal] = useState(defaultValue ?? null);
  const selected = value !== undefined ? value : internal;
  const pick = id => {
    if (value === undefined) setInternal(id);
    onChange && onChange(id);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "radiogroup",
    style: {
      display: "grid",
      gap: 12,
      ...style
    }
  }, rest), tasks.map(t => {
    const on = selected === t.id;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      role: "radio",
      "aria-checked": on,
      onClick: () => pick(t.id),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        width: "100%",
        minHeight: 72,
        padding: "16px 18px",
        textAlign: "left",
        cursor: "pointer",
        background: on ? "var(--brand-soft)" : "var(--surface-card)",
        border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
        boxShadow: on ? "var(--shadow-2)" : "var(--shadow-1)",
        transition: "all var(--dur-base) var(--ease-calm)",
        fontFamily: "var(--font-sans)"
      },
      onMouseEnter: e => {
        if (!on) {
          e.currentTarget.style.borderColor = "var(--border-strong)";
          e.currentTarget.style.transform = "var(--lift)";
        }
      },
      onMouseLeave: e => {
        if (!on) {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.transform = "none";
        }
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 48,
        height: 48,
        borderRadius: 14,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: on ? "var(--brand)" : "var(--bg-inset)",
        color: on ? "var(--ivory)" : "var(--brand)",
        transition: "all var(--dur-base) var(--ease-calm)"
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: t.icon,
      size: 24
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontSize: "var(--text-md)",
        fontWeight: 600,
        color: "var(--text-strong)"
      }
    }, t.label), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontSize: "var(--text-sm)",
        color: "var(--text-muted)",
        marginTop: 2
      }
    }, t.note)), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 24,
        height: 24,
        borderRadius: "50%",
        flexShrink: 0,
        border: `2px solid ${on ? "var(--brand)" : "var(--border-strong)"}`,
        background: on ? "var(--brand)" : "transparent",
        color: "var(--ivory)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all var(--dur-base) var(--ease-calm)"
      }
    }, on && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "check",
      size: 14,
      strokeWidth: 3
    })));
  }));
}
Object.assign(__ds_scope, { TaskPicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/TaskPicker.jsx", error: String((e && e.message) || e) }); }

// components/product/TrustBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DEFAULT_ITEMS = [{
  icon: "shield-check",
  text: "30-day full refund",
  sub: "No questions, ever"
}, {
  icon: "user-check",
  text: "Verified associates",
  sub: "Introduced by name & photo"
}, {
  icon: "camera",
  text: "Every task closed with proof",
  sub: "Photos, receipts, a written note"
}, {
  icon: "lock",
  text: "Your family's data stays private",
  sub: "Encrypted. Never sold. Yours to delete."
}];

/** Trust bar — the four promises. Legible even as a cropped screenshot. */
function TrustBar({
  items = DEFAULT_ITEMS,
  dark = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "var(--space-4)",
      padding: "var(--space-5)",
      background: dark ? "rgba(255,255,255,0.04)" : "var(--surface-card)",
      border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "var(--border)"}`,
      borderRadius: "var(--radius-xl)",
      boxShadow: dark ? "none" : "var(--shadow-2)",
      ...style
    }
  }, rest), items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.text,
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 42,
      height: 42,
      borderRadius: 12,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: dark ? "rgba(224,190,132,0.14)" : "var(--brand-soft)",
      color: dark ? "var(--gold-300)" : "var(--brand)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: it.icon,
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-base)",
      fontWeight: 600,
      color: dark ? "var(--ivory)" : "var(--text-strong)"
    }
  }, it.text), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      color: dark ? "rgba(255,255,255,0.6)" : "var(--text-muted)"
    }
  }, it.sub)))));
}
Object.assign(__ds_scope, { TrustBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/TrustBar.jsx", error: String((e && e.message) || e) }); }

// components/product/WhatsAppQuoteCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** WhatsApp-screenshot-style quote card from a paying NRI. */
function WhatsAppQuoteCard({
  quote,
  name,
  location,
  time = "6:12 AM",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--wa-bg)",
      backgroundImage: "var(--jaali)",
      backgroundSize: "56px",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-5)",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-2)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--wa-in)",
      borderRadius: 14,
      borderTopLeftRadius: 4,
      padding: "12px 14px 8px",
      boxShadow: "0 1px 1px rgba(0,0,0,0.10)",
      maxWidth: "94%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 700,
      color: "var(--forest-600)",
      marginBottom: 4
    }
  }, name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-base)",
      color: "var(--ink-900)",
      lineHeight: 1.5,
      margin: 0
    }
  }, quote), /*#__PURE__*/React.createElement("span", {
    style: {
      float: "right",
      marginTop: 4,
      fontSize: 10.5,
      color: "var(--ink-400)"
    }
  }, time, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#4C8BF5",
      letterSpacing: -3
    }
  }, "\u2713\u2713"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: "var(--text-sm)",
      color: "var(--ink-500)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "map-pin",
    size: 14
  }), " ", location));
}
Object.assign(__ds_scope, { WhatsAppQuoteCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/WhatsAppQuoteCard.jsx", error: String((e && e.message) || e) }); }

// components/product/WhatsAppShowcase.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** A single voice-note waveform (static bars, "elevated native"). */
function Waveform({
  played = 0.4,
  dark
}) {
  const bars = [7, 12, 20, 14, 9, 16, 22, 18, 11, 24, 15, 8, 13, 19, 10, 6, 14, 21, 12, 7];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 3,
      height: 26,
      flex: 1
    }
  }, bars.map((h, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 2.5,
      height: h,
      borderRadius: 2,
      background: i / bars.length < played ? dark ? "var(--accent-300, #E0BE84)" : "var(--forest-600)" : dark ? "rgba(255,255,255,0.28)" : "rgba(30,69,54,0.28)"
    }
  })));
}
function Bubble({
  m,
  dark
}) {
  const out = m.from === "you";
  const bg = out ? "var(--wa-out)" : "var(--wa-in)";
  const color = dark ? "var(--text-strong)" : "var(--ink-900)";
  const common = {
    maxWidth: "82%",
    alignSelf: out ? "flex-end" : "flex-start",
    background: bg,
    color,
    padding: m.type === "voice" ? "10px 12px" : "8px 11px 6px",
    borderRadius: 14,
    borderBottomRightRadius: out ? 4 : 14,
    borderBottomLeftRadius: out ? 14 : 4,
    boxShadow: "0 1px 1px rgba(0,0,0,0.12)",
    fontSize: "var(--text-sm)",
    lineHeight: 1.45,
    position: "relative"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: common
  }, !out && m.sender && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 700,
      color: "var(--forest-600)",
      marginBottom: 2,
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, m.sender, m.badge && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      color: "var(--accent-strong)",
      background: "var(--accent-soft)",
      padding: "1px 6px",
      borderRadius: 999
    }
  }, m.badge)), m.type === "voice" ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      minWidth: 200
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: out ? "var(--forest-600)" : "var(--forest-700)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "play",
    size: 15,
    strokeWidth: 0,
    style: {
      fill: "#fff"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Waveform, {
    played: m.played ?? 0.35,
    dark: dark
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--text-muted)",
      flexShrink: 0
    }
  }, m.dur)) : /*#__PURE__*/React.createElement("span", null, m.text), /*#__PURE__*/React.createElement("span", {
    style: {
      float: "right",
      marginLeft: 10,
      marginTop: 4,
      fontSize: 10.5,
      color: "var(--text-muted)",
      display: "inline-flex",
      alignItems: "center",
      gap: 3
    }
  }, m.time, out && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#4C8BF5",
      fontWeight: 700,
      letterSpacing: -3,
      marginLeft: 2
    }
  }, "\u2713\u2713")));
}

/**
 * WhatsApp-conversation showcase — the hero proof format. Native-feeling but elevated:
 * "Leo" sender label, voice-note bubbles, read receipts. Real conversations go in `messages`.
 */
function WhatsAppShowcase({
  title = "Leo",
  status = "online",
  dark = false,
  messages = DEFAULT_MESSAGES,
  caption,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: "100%",
      maxWidth: 380,
      borderRadius: "var(--radius-xl)",
      overflow: "hidden",
      boxShadow: "var(--shadow-3)",
      border: "1px solid var(--border)",
      background: "var(--wa-bg)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "13px 16px",
      background: "var(--forest-700)",
      color: "var(--ivory)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "var(--gold-500)",
      color: "var(--forest-950)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 20,
      flexShrink: 0
    }
  }, "L"), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 15
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(255,255,255,0.75)",
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: "#7BdfA6"
    }
  }), status)), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "phone",
    size: 19,
    style: {
      marginLeft: "auto",
      color: "rgba(255,255,255,0.85)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9,
      padding: "18px 14px",
      background: dark ? "var(--wa-bg)" : "var(--wa-bg)",
      backgroundImage: "var(--jaali)",
      backgroundSize: "60px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: "center",
      background: "rgba(255,255,255,0.7)",
      color: "var(--ink-500)",
      fontSize: 11,
      padding: "4px 12px",
      borderRadius: 999,
      marginBottom: 4
    }
  }, "Today"), messages.map((m, i) => /*#__PURE__*/React.createElement(Bubble, {
    key: i,
    m: m,
    dark: dark
  }))), caption && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      background: "var(--surface-card)",
      borderTop: "1px solid var(--border)",
      fontSize: "var(--text-xs)",
      color: "var(--text-muted)",
      textAlign: "center"
    }
  }, caption));
}
const DEFAULT_MESSAGES = [{
  from: "you",
  type: "text",
  text: "Leo, Papa has a cardiology follow-up this week. Can you sort it?",
  time: "8:02 AM"
}, {
  from: "leo",
  sender: "Leo",
  badge: "your associate: Priya",
  type: "text",
  text: "On it. I'll call Apollo Jubilee Hills now and find the earliest slot with Dr. Rao. Will confirm before I book anything.",
  time: "8:04 AM"
}, {
  from: "leo",
  sender: "Leo",
  type: "voice",
  dur: "0:24",
  played: 0.5,
  time: "8:19 AM"
}, {
  from: "leo",
  sender: "Leo",
  type: "text",
  text: "Booked — Thursday 11:30 AM. Priya will accompany Papa and share the prescription here after. 🙏",
  time: "8:20 AM"
}, {
  from: "you",
  type: "text",
  text: "Thank you. Genuinely.",
  time: "8:21 AM"
}];
Object.assign(__ds_scope, { WhatsAppShowcase });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/WhatsAppShowcase.jsx", error: String((e && e.message) || e) }); }

// components/product/EmergencyStory.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const BEATS = [{
  time: "2:47 AM",
  place: "Jersey City",
  text: "Your phone lights the ceiling. A missed call from home is the worst kind of light.",
  icon: "clock"
}, {
  time: "2:47 AM",
  place: "Leo",
  text: "We're already awake. Your associate Priya is calling the Pune ambulance line while you're still reading this.",
  icon: "phone"
}, {
  time: "3:10 AM",
  place: "Pune",
  text: "Papa is in the car, seatbelt on, a familiar voice beside him. You approve the hospital from your bed with one tap.",
  icon: "heart-pulse"
}, {
  time: "6:30 AM",
  place: "Your kitchen",
  text: "Coffee. A voice note: \"He's admitted, stable, resting. Reports attached. I'll stay till morning rounds.\"",
  icon: "check-circle"
}];
const NIGHT_MESSAGES = [{
  from: "leo",
  sender: "Leo",
  badge: "assoc: Priya",
  type: "text",
  text: "I've got this. Ambulance dispatched to the flat — ETA 9 minutes. I'm on the line with them now.",
  time: "2:49 AM"
}, {
  from: "you",
  type: "text",
  text: "I'm 12,000 km away and shaking. Please.",
  time: "2:50 AM"
}, {
  from: "leo",
  sender: "Leo",
  type: "voice",
  dur: "0:18",
  played: 0.6,
  time: "2:51 AM"
}, {
  from: "leo",
  sender: "Leo",
  type: "text",
  text: "He's in the car. I'm with him. Breathe — you don't have to do this alone tonight.",
  time: "3:04 AM"
}];

/** Emergency-story section (dark) — the 2:47 AM narrative as a scrolling vignette. */
function EmergencyStory({
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("section", _extends({
    "data-theme": "dark",
    style: {
      background: "radial-gradient(120% 80% at 80% 0%, #12281F 0%, var(--forest-950) 55%, #060F0B 100%)",
      color: "var(--text-body)",
      padding: "var(--space-9) var(--gutter)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640,
      marginBottom: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: "var(--text-xs)",
      fontWeight: 600,
      letterSpacing: "var(--tracking-wide)",
      textTransform: "uppercase",
      color: "var(--gold-300)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 1,
      background: "var(--gold-400)"
    }
  }), " The 2:47 AM promise"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--text-3xl)",
      color: "#fff",
      margin: "16px 0 14px"
    }
  }, "Emergencies don't check the time zone."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-md)",
      color: "rgba(255,255,255,0.72)",
      lineHeight: 1.6
    }
  }, "The call you dread comes when you can do the least. This is the one night we were built for.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-7)",
      gridTemplateColumns: "minmax(0,1fr)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("ol", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)"
    }
  }, BEATS.map((b, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      gap: 18,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 46,
      height: 46,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: i === 1 ? "var(--gold-500)" : "rgba(255,255,255,0.06)",
      color: i === 1 ? "var(--forest-950)" : "var(--gold-300)",
      border: "1px solid rgba(255,255,255,0.12)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: b.icon,
    size: 22
  })), i < BEATS.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      flex: 1,
      minHeight: 26,
      background: "rgba(255,255,255,0.14)",
      marginTop: 6
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-lg)",
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, b.time), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--gold-300)"
    }
  }, b.place)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-md)",
      color: "rgba(255,255,255,0.82)",
      lineHeight: 1.55,
      maxWidth: 460
    }
  }, b.text))))), /*#__PURE__*/React.createElement("div", {
    style: {
      justifySelf: "center",
      width: "100%",
      maxWidth: 380
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.WhatsAppShowcase, {
    dark: true,
    status: "online \xB7 2:51 AM",
    messages: NIGHT_MESSAGES,
    caption: "An actual night. Shared with the family's permission."
  })))));
}
Object.assign(__ds_scope, { EmergencyStory });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/EmergencyStory.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/LandingPage.jsx
try { (() => {
const DS = window.LeoDesignSystem_a92d8b;
const {
  Nav,
  Footer,
  Button,
  Card,
  Badge,
  Eyebrow,
  Icon,
  WhatsAppShowcase,
  TaskPicker,
  PricingCard,
  DepositCTA,
  PledgeInterstitial,
  WhatsAppQuoteCard,
  ParentVoiceCard,
  TrustBar,
  EmergencyStory
} = DS;
const wrap = {
  maxWidth: "var(--container)",
  margin: "0 auto",
  padding: "0 var(--gutter)"
};

/** Warm-graded photo placeholder — signals the intended candid shot without stock imagery. */
function Photo({
  caption,
  h = 340,
  tone = "day",
  style
}) {
  const bg = tone === "night" ? "linear-gradient(150deg,#0E241C,#1A2A24 60%,#3B2E1C)" : "linear-gradient(150deg,#EAD9B8,#E7C79A 45%,#C9986A)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: h,
      borderRadius: "var(--radius-xl)",
      overflow: "hidden",
      background: bg,
      boxShadow: "var(--shadow-3)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "var(--jaali)",
      backgroundSize: "64px",
      opacity: 0.5
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(120% 100% at 30% 20%, transparent 40%, rgba(0,0,0,0.28))"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 18,
      bottom: 16,
      right: 18,
      display: "flex",
      alignItems: "center",
      gap: 9,
      color: "rgba(255,255,255,0.92)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "camera",
    size: 17
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      fontStyle: "italic",
      textShadow: "0 1px 3px rgba(0,0,0,0.4)"
    }
  }, caption)));
}
function Section({
  children,
  style,
  id
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: id,
    style: {
      padding: "var(--space-9) 0",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, children));
}
function SectionHead({
  eyebrow,
  title,
  sub,
  center,
  max = 640
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: max,
      margin: center ? "0 auto" : 0,
      textAlign: center ? "center" : "left",
      marginBottom: "var(--space-7)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: center ? "center" : "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, eyebrow)), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--text-3xl)",
      margin: "16px 0 12px"
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-md)",
      color: "var(--text-body)",
      lineHeight: 1.6
    }
  }, sub));
}

/* ---------- Hero ---------- */
function Hero({
  onReserve
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "var(--jaali)",
      backgroundSize: "72px",
      opacity: 0.6,
      maskImage: "linear-gradient(180deg,transparent,black 30%,black 70%,transparent)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      position: "relative",
      display: "grid",
      gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)",
      gap: "var(--space-8)",
      alignItems: "center",
      padding: "var(--space-8) var(--gutter) var(--space-9)"
    },
    className: "hero-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: "brand",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 13
    })
  }, "Now opening: New Jersey \xB7 London \xB7 Toronto"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "var(--text-4xl)",
      margin: "20px 0 20px",
      letterSpacing: "-0.025em"
    }
  }, "Be there.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--brand)"
    }
  }, "Without moving back.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-lg)",
      color: "var(--text-body)",
      lineHeight: 1.55,
      maxWidth: 460,
      fontFamily: "var(--font-sans)"
    }
  }, "Leo is your family's presence in India \u2014 a calm, capable friend, backed by real technology, who looks after your parents, your property, and the life-admin you can't do from 12,000 km away."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: onReserve,
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18
    })
  }, "Give Leo your first task \u2014 free"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    as: "a",
    href: "#how"
  }, "See how it works")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 20,
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 16
  }), " No card today \xB7 Fully refundable, always")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(WhatsAppShowcase, {
    caption: "A real morning with Leo. Names changed for privacy."
  }))));
}

/* ---------- How it works ---------- */
function HowItWorks() {
  const steps = [{
    icon: "message-circle",
    n: "01",
    t: "Tell Leo, in a message",
    d: "Text or a voice note on WhatsApp — the way you'd ask a sibling. No app to learn, no forms."
  }, {
    icon: "user-check",
    t: "We assign someone real",
    n: "02",
    d: "A verified associate near your parents — introduced to you by name and photo before anything begins."
  }, {
    icon: "camera",
    t: "It's done, with proof",
    n: "03",
    d: "You get the update, the receipt, the photo. The quiet relief of knowing it actually happened."
  }];
  return /*#__PURE__*/React.createElement(Section, {
    id: "how",
    style: {
      background: "var(--bg-inset)"
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "How Leo works",
    title: "Three steps. Then you can breathe.",
    sub: "No dashboards. No jargon. It works the way your family already talks."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
      gap: "var(--space-5)"
    }
  }, steps.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.n,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 15,
      background: "var(--brand-soft)",
      color: "var(--brand)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 26
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 34,
      color: "var(--sand-300)"
    }
  }, s.n)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "var(--text-lg)"
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-base)",
      color: "var(--text-body)",
      lineHeight: 1.55
    }
  }, s.d)))));
}

/* ---------- Task picker CTA ---------- */
function TaskSection({
  onReserve
}) {
  const [task, setTask] = React.useState("doctor");
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.1fr)",
      gap: "var(--space-8)",
      alignItems: "center"
    },
    className: "hero-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Try it in your head",
    title: "What would you hand to Leo first?",
    sub: "Pick one. This is exactly how it starts \u2014 one thing off your plate, handled properly."
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: onReserve,
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18
    })
  }, "Give Leo this task \u2014 free"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 14,
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, "Your first task is on us. No card, no catch.")), /*#__PURE__*/React.createElement(TaskPicker, {
    value: task,
    onChange: setTask
  })));
}

/* ---------- Testimonials ---------- */
function Testimonials() {
  return /*#__PURE__*/React.createElement(Section, {
    style: {
      background: "var(--bg-inset)"
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    center: true,
    eyebrow: "From both sides of the call",
    title: "Relief you can read in their words.",
    max: 720
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
      gap: "var(--space-5)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(WhatsAppQuoteCard, {
    quote: "Leo handled Papa's hospital admission before I'd even woken up. I read the whole thing over coffee, already done.",
    name: "Ananya",
    location: "New Jersey",
    time: "6:12 AM"
  }), /*#__PURE__*/React.createElement(WhatsAppQuoteCard, {
    quote: "They sent Amma's favourite kaju katli on her birthday and a photo of her face. I cried at my desk in London.",
    name: "Rohan",
    location: "London",
    time: "9:40 PM"
  }), /*#__PURE__*/React.createElement(ParentVoiceCard, {
    hinglish: "Beta se roz baat nahi ho paati, par ab akela nahi lagta.",
    translation: "I can't speak to my son every day \u2014 but I no longer feel alone.",
    name: "Suresh",
    relation: "Father, Pune"
  })));
}

/* ---------- Pricing + Deposit ---------- */
function Pricing({
  onReserve
}) {
  return /*#__PURE__*/React.createElement(Section, {
    id: "pricing"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    center: true,
    eyebrow: "Simple, honest pricing",
    title: "One membership. Your whole family, looked after.",
    sub: "Everyday tasks, emergencies, the frustrating paperwork \u2014 all included. Cancel anytime.",
    max: 680
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "var(--space-7)"
    }
  }, /*#__PURE__*/React.createElement(PricingCard, {
    onChoose: onReserve
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(DepositCTA, {
    onReserve: onReserve
  })));
}

/* ---------- Founder note ---------- */
function Founder() {
  return /*#__PURE__*/React.createElement(Section, {
    style: {
      background: "var(--forest-950)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,0.8fr) minmax(0,1.2fr)",
      gap: "var(--space-8)",
      alignItems: "center"
    },
    className: "hero-grid"
  }, /*#__PURE__*/React.createElement(Photo, {
    tone: "night",
    h: 380,
    caption: "Evening light in a Pune living room \u2014 where this started."
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "A note from our founder"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--text-2xl)",
      color: "#fff",
      margin: "16px 0 18px",
      fontStyle: "italic",
      fontWeight: 400
    }
  }, "\"I built Leo the year I missed my father's surgery. I was on a call in Seattle while my mother sat alone in a Pune waiting room.\""), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-md)",
      color: "rgba(255,255,255,0.78)",
      lineHeight: 1.65,
      marginBottom: 16
    }
  }, "I couldn't move back. Most of us can't. So I made the next best thing \u2014 someone steady, on the ground, who treats your parents like their own. Not an app. A presence."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-md)",
      color: "rgba(255,255,255,0.78)",
      lineHeight: 1.65,
      marginBottom: 24
    }
  }, "If you're carrying that same quiet guilt, I'd like Leo to carry some of it for you."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      height: 52,
      borderRadius: "50%",
      background: "var(--gold-500)",
      color: "var(--forest-950)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-display)",
      fontSize: 22,
      fontWeight: 600
    }
  }, "A"), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.35
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#fff",
      fontWeight: 600
    }
  }, "Arjun Mehta"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--gold-300)",
      fontSize: "var(--text-sm)"
    }
  }, "Founder \xB7 once 12,000 km away too"))))));
}

/* ---------- Pledge modal ---------- */
function PledgeModal({
  open,
  onClose
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 100,
      background: "rgba(12,31,24,0.55)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--gutter)",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: 480,
      margin: "auto"
    }
  }, /*#__PURE__*/React.createElement(PledgeInterstitial, {
    city: "New Jersey",
    onConfirm: onClose,
    onBack: onClose
  })));
}

/* ---------- Page ---------- */
function LandingPage() {
  const [pledge, setPledge] = React.useState(false);
  const reserve = () => setPledge(true);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("style", null, `@media(max-width:820px){.hero-grid{grid-template-columns:1fr !important}}`), /*#__PURE__*/React.createElement(Nav, {
    cta: "Reserve your spot",
    onCta: reserve
  }), /*#__PURE__*/React.createElement(Hero, {
    onReserve: reserve
  }), /*#__PURE__*/React.createElement(HowItWorks, null), /*#__PURE__*/React.createElement(TaskSection, {
    onReserve: reserve
  }), /*#__PURE__*/React.createElement(EmergencyStory, null), /*#__PURE__*/React.createElement(Testimonials, null), /*#__PURE__*/React.createElement(Pricing, {
    onReserve: reserve
  }), /*#__PURE__*/React.createElement(Founder, null), /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: "var(--space-8)",
      paddingBottom: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    center: true,
    eyebrow: "Why families trust Leo",
    title: "The promises we keep.",
    max: 640
  }), /*#__PURE__*/React.createElement(TrustBar, null)), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(PledgeModal, {
    open: pledge,
    onClose: () => setPledge(false)
  }));
}
window.LandingPage = LandingPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/LandingPage.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.GoogleSignIn = __ds_scope.GoogleSignIn;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.Nav = __ds_scope.Nav;

__ds_ns.DepositCTA = __ds_scope.DepositCTA;

__ds_ns.EmergencyStory = __ds_scope.EmergencyStory;

__ds_ns.ParentVoiceCard = __ds_scope.ParentVoiceCard;

__ds_ns.PledgeInterstitial = __ds_scope.PledgeInterstitial;

__ds_ns.PricingCard = __ds_scope.PricingCard;

__ds_ns.TaskPicker = __ds_scope.TaskPicker;

__ds_ns.TrustBar = __ds_scope.TrustBar;

__ds_ns.WhatsAppQuoteCard = __ds_scope.WhatsAppQuoteCard;

__ds_ns.WhatsAppShowcase = __ds_scope.WhatsAppShowcase;

})();
