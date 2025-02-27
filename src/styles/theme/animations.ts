import { Easing } from 'react-native';

export const timing = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export const easing = {
  bounce: Easing.bounce,
  elastic: Easing.elastic(1),
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
  spring: Easing.spring,
};

export const transitions = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: timing.normal,
    easing: easing.smooth,
  },
  slideUp: {
    from: { translateY: 20, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
    duration: timing.normal,
    easing: easing.smooth,
  },
  scale: {
    from: { scale: 0.9, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    duration: timing.normal,
    easing: easing.bounce,
  },
}; 