import React from "react";

export default ({ x, y, opacity }) => {
  return (
    <svg
      x={x}
      y={y}
      opacity={opacity}
      width="14"
      height="14"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.17157 0.146447L7.35355 3.32843C7.54882 3.52369 7.54882 3.84027 7.35355 4.03553L4.17157 7.21751C3.97631 7.41278 3.65973 7.41278 3.46447 7.21751C3.2692 7.02225 3.2692 6.70567 3.46447 6.51041L5.79289 4.18198H0V3.18198H5.79289L3.46447 0.853553C3.2692 0.658291 3.2692 0.341709 3.46447 0.146447C3.65973 -0.0488155 3.97631 -0.0488155 4.17157 0.146447Z"
        transform="translate(7.5 7.36377) rotate(180)"
        fill="url(#paint0_linear)"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x2="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(7.5 7.2463) scale(7 7.12932) rotate(180)"
        >
          <stop stopColor="#C10101" />
          <stop offset="0.480663" stopColor="#E81616" />
          <stop offset="1" stopColor="#D81A1A" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
};
