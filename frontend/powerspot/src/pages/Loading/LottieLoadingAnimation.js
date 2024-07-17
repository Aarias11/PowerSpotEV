import React from 'react';
import Lottie from 'react-lottie';
import animationData from './loadingAnimation.json';

function LottieLoadingAnimation() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="lottie-container">
      <Lottie options={defaultOptions} />
    </div>
  );
}

export default LottieLoadingAnimation;