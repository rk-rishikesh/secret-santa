import React, { useState } from "react";
import { useEffectOnce, useEventListener } from "usehooks-ts";

import NavBar from "../Components/nav/NavBar";
import Hero from "../Pages/Hero";
import Skills from "../Pages/Skills";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffectOnce(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
    setIsMobile(window.innerWidth < 768);
  });

  useEventListener("resize", () => {
    setIsMobile(window.innerWidth < 768);
  });

  if (isMobile) {
    return (
      <>
        <div>
          <img
            className="w-[100vh] h-[100vh]"
            src="/desktop.png"
            alt=""
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <>
          <NavBar />
          <Hero />
          <Skills />
        </>
      </>
    );
  }
}

export default App;
