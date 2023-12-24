import React, { useState, useEffect } from "react";
import MarqueeCards from "../Components/MarqueeCards";
import SectionTitle from "../Components/SectionTitle";
import SkillsCards from "../Components/SkillsCards";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import {
  CHRISTMASTREEABI,
  CHRISTMASTREEADDRESS,
} from "../Constants/christmasTree";
const Skills = (
) => {
  const [hasTree, setHasTree] = useState(false);

  useEffect(() => {
    const checkHasTree = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      console.log(provider);
      const ethereum = await window.ethereum;

      const signer = await new ethers.BrowserProvider(ethereum).getSigner();
      console.log(signer);

      const tree = new ethers.Contract(
        CHRISTMASTREEADDRESS,
        CHRISTMASTREEABI,
        signer
      );

      console.log(await tree.balanceOf(signer.address));
      if ((await tree.balanceOf(signer.address)) >= 1) {
        console.log(true)
        setHasTree(true);
      }
    };
    checkHasTree();
  }, []);

  return (
    <>
      {hasTree && (
        <div
          id="skills"
          className="pb-4 w-full overflow-hidden-web flex justify-center"
        >
          <div className="w-full min-h-[350px] flex flex-col xl:w-[70%]">
            <div className="w-full">
              <SectionTitle title=" " subtitle="" />
            </div>
            <div className="xl:border-l-2 xl:border-r-2 xl:border-primary-400 h-full">
              <div className="relative">
                <div className="absolute top-[45px] w-full h-[1px] bg-primary-400"></div>
                <MarqueeCards direction="left">
                  <SkillsCards />
                </MarqueeCards>
              </div>
            </div>
          </div>
        </div>
      )}
      {true && <></>}
    </>
  );
};

export default Skills;
