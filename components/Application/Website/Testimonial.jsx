'use client'
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { IoIosStar } from "react-icons/io";

const testimonials = [
  {
    name: "Ali Khan",
    review: "This service completely exceeded my expectations.\nThe quality and attention to detail were outstanding.\nI would definitely recommend it to anyone looking for reliability.",
    rating: 5
  },
  {
    name: "Sara Ahmed",
    review: "I had a great experience from start to finish.\nThe team was responsive and very professional.\nWill surely come back again for future needs.",
    rating: 4
  },
  {
    name: "Usman Tariq",
    review: "Everything was handled smoothly and efficiently.\nCustomer support was always available to help.\nTruly a trustworthy experience overall.",
    rating: 5
  },
  {
    name: "Ayesha Malik",
    review: "The service was good but there is room for improvement.\nI appreciated the effort and timely delivery.\nLooking forward to seeing further enhancements.",
    rating: 4
  },
  {
    name: "Hassan Raza",
    review: "Absolutely loved the professionalism shown.\nThe process was simple and easy to follow.\nHighly satisfied with the end result.",
    rating: 5
  },
  {
    name: "Fatima Noor",
    review: "A very smooth and pleasant experience overall.\nThe team paid attention to every small detail.\nWould highly recommend to friends and family.",
    rating: 5
  },
  {
    name: "Bilal Sheikh",
    review: "Good service but took slightly longer than expected.\nHowever, the final outcome was worth the wait.\nCustomer care was polite and helpful.",
    rating: 4
  },
  {
    name: "Zainab Ali",
    review: "I’m really impressed with the overall quality.\nEverything was handled professionally.\nWould definitely use this again in the future.",
    rating: 5
  },
  {
    name: "Omar Farooq",
    review: "Decent experience with some minor issues.\nSupport team resolved problems quickly.\nSatisfied with the final delivery.",
    rating: 4
  },
  {
    name: "Hira Siddiqui",
    review: "Fantastic service and great communication.\nThe entire process was seamless and stress-free.\nHighly recommend it to everyone.",
    rating: 5
  }
];

const Testimonial = () => {

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    pauseOnHover: false,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ],
  };

  return (
    <div className="w-full px-4 py-10 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8">
       Customers Review
      </h2>

      <Slider {...settings}>
        {testimonials.map((item, index) => (
          <div key={index} className="px-3">
            <div className="bg-white p-6 rounded-2xl shadow-md h-full flex flex-col justify-between">
              
              {/* Review */}
              <p className="text-gray-700 whitespace-pre-line mb-4">
                {item.review}
              </p>

              {/* Name */}
              <h4 className="font-semibold text-lg mb-2">
                {item.name}
              </h4>

              {/* Rating */}
              <div className="flex">
                {Array.from({ length: item.rating }).map((_, starIndex) => (
                  <IoIosStar
                    key={starIndex}
                    className="text-yellow-500"
                    size={22}
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