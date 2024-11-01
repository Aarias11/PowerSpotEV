// LottieAnimation.js
import React from 'react';
import Lottie from 'react-lottie';
import animationData from './SustainabilityAnimation.json';

const LottieSustainabilityAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return <Lottie options={defaultOptions} height={180} width={180}  />;
};

export default LottieSustainabilityAnimation;