'use client'
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { IoIosStar } from "react-icons/io";

const testimonials = [
  // your same data
];

const Testimonial = () => {

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToScroll: 1,
    pauseOnHover: true,

    slidesToShow: 3,
    arrows: true,

    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false, // better UX on mobile
        }
      }
    ],
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-10 py-10 bg-gray-100">
      
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
        Customers Review
      </h2>

      <Slider {...settings}>
        {testimonials.map((item, index) => (
          <div key={index} className="px-2 sm:px-3">
            
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md h-full flex flex-col justify-between min-h-[220px] sm:min-h-[260px]">
              
              {/* Review */}
              <p className="text-gray-700 text-sm sm:text-base whitespace-pre-line mb-4">
                {item.review}
              </p>

              {/* Name */}
              <h4 className="font-semibold text-base sm:text-lg mb-2">
                {item.name}
              </h4>

              {/* Rating */}
              <div className="flex">
                {Array.from({ length: item.rating }).map((_, starIndex) => (
                  <IoIosStar
                    key={starIndex}
                    className="text-yellow-500"
                    size={18}
                  />
                ))}
              </div>

            </div>

          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonial;