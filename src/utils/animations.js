import {Dimensions} from 'react-native';

export function animatedStyles(index, animatedValue, carouselProps) {
  let animatedOpacity = {};
  let animatedTransform = {};
  let sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
  let translateProp = carouselProps.vertical ? 'translateY' : 'translateX';

  if (carouselProps.inactiveSlideOpacity < 1) {
    animatedOpacity = {
      opacity: animatedValue.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [0, 0.6, 1],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.7, 1],
          }),
        },
      ],
    };
  }

  return {
    ...animatedOpacity,
    ...animatedTransform,
  };
}


import {Platform} from 'react-native';
