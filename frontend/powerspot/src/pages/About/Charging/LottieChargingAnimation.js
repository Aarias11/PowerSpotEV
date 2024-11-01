// LottieAnimation.js
import React from 'react';
import Lottie from 'react-lottie';
import animationData from './chargingAnimation.json';

const LottieChargingAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return <Lottie options={defaultOptions} height={250} width={250} />;
};

export default LottieChargingAnimation;