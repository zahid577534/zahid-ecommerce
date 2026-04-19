'use client'
import { Section } from 'lucide-react'
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; // Import the CSS files for react-slick
import Slider from "react-slick";
import Image from 'next/image';
import slider1 from '@/public/assets/images/slider-1.png'
import slider2  from '@/public/assets/images/slider-2.png'
import slider3 from '@/public/assets/images/slider-3.png'
import slider4 from '@/public/assets/images/slider-4.png'
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";
//import { A } from '@faker-js/faker/dist/airline-eVQV6kbz';
import next from 'next';
const ArrowNext = (props) => {
    const { onClick } = props
    return (
        <button onClick={onClick} type='button' className='w-14 h-14 flex justify-center items-center
        rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white right-10'>
            <FaCircleChevronRight size={25} className='text-gray-600' />
        </button>
        )
}
const ArrowPrev = (props) => {  
    const { onClick } = props   
    return (
        <button onClick={onClick} type='button' className='w-14 h-14 flex justify-center items-center
        rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white left-10'>
            <FaCircleChevronLeft size={25} className='text-gray-600' />
        </button>
    )
}

const MainSlider = () => {
    const settings = {
  dots: true,
  infinite: true,
  speed: 800,              // transition speed (animation)
  autoplay: true,
  autoplaySpeed: 3000,     // time between slides (important)
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  pauseOnHover: false,     // keeps moving even on hover
  nextArrow: <ArrowNext />,
  prevArrow: <ArrowPrev />,

  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        dots: true,
      },
    },
  ],
}
  return (
   <div>
    <Slider {...settings}>
        <div>
            <Image src={slider1.src} width={slider1.width} height={slider1.height} alt='slider1' className='w-full h-auto'/>
        </div>
        <div>
            <Image src={slider2.src} width={slider2.width} height={slider2.height} alt='slider2' className='w-full h-auto'/>
        </div>
        <div>
            <Image src={slider3.src} width={slider3.width} height={slider3.height} alt='slider3' className='w-full h-auto'/>
        </div>
        <div>
            <Image src={slider4.src} width={slider4.width} height={slider4.height} alt='slider4' className='w-full h-auto'/>
        </div>
    </Slider>
   </div>
  )
}

export default MainSlider