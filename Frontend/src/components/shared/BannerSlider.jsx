import SliderLib from "react-slick";
import React from "react";
// react-slick may export the component as a CommonJS default under `.default`.
// Use a small shim so both ESM and CJS consumers work with Vite.
const Slider = SliderLib && (SliderLib.default || SliderLib);
import { banners } from "../../utils/constants";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerSlider = () => {
  const settings = {
    centerMode: true,
    centerPadding: "400px", // side preview space (adjust as you like)
    slidesToShow: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 800,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { centerPadding: "180px" },
      },
      {
        breakpoint: 768,
        settings: { centerMode: false, centerPadding: "0px" },
      },
    ],
  };

  return (
    <div className="w-full bg-white py-6">
      <div className="mx-auto px-4">
          <Slider {...settings}>
              {banners.map((banner, i) => (
              <div key={i} className="px-2">
                <img
                  src={banner}
                  alt={`banner-${i}`}
                  className="w-full h-[300px] rounded-xl object-cover"
                />
              </div>
            ))}
          </Slider>
      </div>
    </div>
  );
};

export default BannerSlider;