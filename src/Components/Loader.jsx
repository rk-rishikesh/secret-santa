import React from "react";

const Loader = () => {
  return (

    <div className="w-screen h-screen bg-grayscale-950 flex items-center justify-center relative">
      <span
        style={{ fontFamily: "SuperMario" }}
        className="absolute text-primary-400 text-xl"
      >
        Loading
      </span>
      <div className="loader"></div>
    </div>

  );
};

export default Loader;