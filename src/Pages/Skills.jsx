import React, { useState, useEffect } from "react";
import MarqueeCards from "../Components/MarqueeCards";
import SectionTitle from "../Components/SectionTitle";
import SkillsCards from "../Components/SkillsCards";
import { TokenboundClient } from "@tokenbound/sdk";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import {
  CHRISTMASTREEABI,
  CHRISTMASTREEADDRESS,
} from "../Constants/christmasTree";
import { MESSAGEABI, MESSAGEADDRESS } from "../Constants/message";
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

      let tokenID = window.location.pathname;
      tokenID = tokenID.slice(1);
      console.log(tokenID);

      if(tokenID != "") {

        // Its Drop Message Page
        const msg = new ethers.Contract(
          MESSAGEADDRESS,
          MESSAGEABI,
          signer
        );

        const tokenboundClient = new TokenboundClient({
          signer, 
          chainId: 80001, 
          implementationAddress: '0xBf7F4beb68b960AE198a15f4f50247f4Fd20E21a',
          registryAddress: '0x284be69BaC8C983a749956D7320729EB24bc75f9',
        })
    
        const account = await tokenboundClient.getAccount({
          tokenContract: CHRISTMASTREEADDRESS,
          tokenId: tokenID,
        });
    
        console.log(account);

        console.log(await msg.balanceOf(account));
        if(await msg.balanceOf(account) >=1) {
          setHasTree(true);
        }
      } else {
        console.log(await tree.balanceOf(signer.address));
        if ((await tree.balanceOf(signer.address)) >= 1) {
          console.log(true)
          setHasTree(true);
        }
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
    </>
  );
};

export default Skills;
