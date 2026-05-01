import React, { useState, useEffect, useRef } from "react";

const ScrollCounter = ({ end, duration = 2000, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const hasStarted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          let start = 0;
          const increment = end / (duration / 10);

          const counter = setInterval(() => {
            start += increment;
            if (start >= end) {
              start = end;
              clearInterval(counter);
            }
            setCount(Math.ceil(start));
          }, 10);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [end, duration]);

  return (
    <div ref={ref} className="text-center my-10">
      <h2 className="text-5xl font-bold" style={{ color: "#10244b" }}>
        {count}+
      </h2>
      <p className="mt-2 text-lg" style={{ color: "#a3a3a3" }}>
        {label}
      </p>
    </div>
  );
};

export default ScrollCounter;
