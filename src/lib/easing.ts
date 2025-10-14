/**
 * Easing functions for smooth animations
 * All functions take a progress value (0-1) and return an eased value (0-1)
 */

export type EasingFunction = (t: number) => number;

/**
 * No easing - constant speed
 */
export const linear: EasingFunction = (t) => t;

/**
 * Quadratic ease-in - accelerating from zero velocity
 */
export const easeInQuad: EasingFunction = (t) => t * t;

/**
 * Quadratic ease-out - decelerating to zero velocity
 * This is the recommended default for most UI animations
 */
export const easeOutQuad: EasingFunction = (t) => t * (2 - t);

/**
 * Quadratic ease-in-out - acceleration until halfway, then deceleration
 */
export const easeInOutQuad: EasingFunction = (t) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

/**
 * Cubic ease-in - stronger acceleration
 */
export const easeInCubic: EasingFunction = (t) => t * t * t;

/**
 * Cubic ease-out - stronger deceleration
 */
export const easeOutCubic: EasingFunction = (t) => {
  const t1 = t - 1;
  return t1 * t1 * t1 + 1;
};

/**
 * Cubic ease-in-out
 */
export const easeInOutCubic: EasingFunction = (t) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

/**
 * Quartic ease-in - even stronger acceleration
 */
export const easeInQuart: EasingFunction = (t) => t * t * t * t;

/**
 * Quartic ease-out - even stronger deceleration
 */
export const easeOutQuart: EasingFunction = (t) => {
  const t1 = t - 1;
  return 1 - t1 * t1 * t1 * t1;
};

/**
 * Quartic ease-in-out
 */
export const easeInOutQuart: EasingFunction = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;

/**
 * Exponential ease-in - very strong acceleration
 */
export const easeInExpo: EasingFunction = (t) =>
  t === 0 ? 0 : Math.pow(2, 10 * (t - 1));

/**
 * Exponential ease-out - very strong deceleration
 */
export const easeOutExpo: EasingFunction = (t) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

/**
 * Exponential ease-in-out
 */
export const easeInOutExpo: EasingFunction = (t) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
  return (2 - Math.pow(2, -20 * t + 10)) / 2;
};

/**
 * Circular ease-in - slight acceleration
 */
export const easeInCirc: EasingFunction = (t) => 1 - Math.sqrt(1 - t * t);

/**
 * Circular ease-out - slight deceleration
 */
export const easeOutCirc: EasingFunction = (t) => Math.sqrt(1 - (t - 1) * (t - 1));

/**
 * Circular ease-in-out
 */
export const easeInOutCirc: EasingFunction = (t) =>
  t < 0.5
    ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
    : (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2;

/**
 * Back ease-in - slight overshoot on acceleration
 */
export const easeInBack: EasingFunction = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * t * t * t - c1 * t * t;
};

/**
 * Back ease-out - slight overshoot on deceleration
 */
export const easeOutBack: EasingFunction = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/**
 * Back ease-in-out - slight overshoot on both ends
 */
export const easeInOutBack: EasingFunction = (t) => {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  return t < 0.5
    ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
    : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
};

/**
 * Default easing function - ease-out quad for smooth, natural UI animations
 */
export const defaultEasing = easeOutQuad;

/**
 * Named easing functions for easy selection
 */
export const easingFunctions = {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInBack,
  easeOutBack,
  easeInOutBack,
} as const;

export type EasingName = keyof typeof easingFunctions;
