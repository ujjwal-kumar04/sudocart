import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sliderImages } from "../data/sliderImages";
import "./Slider.css";

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const slides = sliderImages && sliderImages.length ? sliderImages : [];
  const navigate = useNavigate();

  useEffect(() => {
    if (!slides.length) return undefined;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, [slides.length]);

  const goTo = (index) => setCurrent((index + slides.length) % slides.length);
  const handleShop = (category) => {
    if (category) {
      navigate('/Shop', { state: { category } });
    }
  };

  return (
    <div className="hero-slider">
      <div
        className="slider-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div
            key={slide.src}
            className={`slide ${idx === current ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.src})` }}
            aria-label={slide.alt}
          >
            <div className="slide-overlay" />
            <div className="slide-content">
              <p className="slide-kicker">Trending now</p>
              <h2 className="slide-title">{slide.alt}</h2>
              <div className="slide-actions">
                <button className="slide-cta" onClick={() => handleShop(slide.category)}>
                  Shop {slide.category || 'now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-controls">
        <button className="nav-btn" onClick={() => goTo(current - 1)} aria-label="Previous slide">
          ‹
        </button>
        <button className="nav-btn" onClick={() => goTo(current + 1)} aria-label="Next slide">
          ›
        </button>
      </div>

      <div className="slider-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === current ? "active" : ""}`}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
