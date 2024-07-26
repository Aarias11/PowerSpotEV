import React from 'react'
import LottieLoadingAnimation from './LottieLoadingAnimation'
import logo from '../../assets/Logo/PowerSpotEV Background Removed.png'

function Loading() {
  return (
    <div className='w-full h-screen bg-[#131313] flex flex-col justify-center items-center gap-4 '>
        <div className='flex items-center'>
        <img className='w-20 ' src={logo} />
        <h2 className='text-slate-300 text-4xl font-semibold'>PowerSpot EV</h2>
        </div>
        <LottieLoadingAnimation />
        <h3 className='text-slate-300 text-[24px] mt-4'>Loading...</h3>
    </div>
  )
}

export default Loading