import { m, LazyMotion, domAnimation } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import { MESSAGEADDRESS } from "../Constants/message";
import {
  CHRISTMASTREEABI,
  CHRISTMASTREEADDRESS,
} from "../Constants/christmasTree";
import { TokenboundClient } from "@tokenbound/sdk";

const SkillsCards = () => {
  const [skills, setSkills] = useState([]);

  const config = {
    apiKey: "w-aEgDPKbBnk4gB9MO8v10gpeJcE0lWY",
    network: Network.MATIC_MUMBAI,
  };
  const alchemy = new Alchemy(config);

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  useEffect(() => {
    const init = async () => {
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

      if (tokenID != "") {
        // Its Drop Message Page
        tokenID = tokenID;
      } else {
        // Owner Page
        tokenID = await tree.userTree(signer.address);
      }

      const tokenboundClient = new TokenboundClient({
        signer,
        chainId: 80001,
        implementationAddress: "0xBf7F4beb68b960AE198a15f4f50247f4Fd20E21a",
        registryAddress: "0x284be69BaC8C983a749956D7320729EB24bc75f9",
      });

      const treeaccount = await tokenboundClient.getAccount({
        tokenContract: CHRISTMASTREEADDRESS,
        tokenId: tokenID,
      });

      // Get Message NFT owned by account
      const nfts = await alchemy.nft.getNftsForOwner(treeaccount);

      // Print NFTs
      console.log(nfts.ownedNfts);
      console.log(nfts.ownedNfts.length);

      let skillList = [];

      for (let i = 0; i < nfts.ownedNfts.length; i++) {
        console.log(nfts.ownedNfts[i].contract.address);
        console.log(nfts.ownedNfts[i].name);
        console.log(nfts.ownedNfts[i].description);
        console.log(nfts.ownedNfts[i].image);
        console.log(nfts.ownedNfts[i].tokenId);

        const msgaccount = await tokenboundClient.getAccount({
          tokenContract: MESSAGEADDRESS,
          tokenId: nfts.ownedNfts[i].tokenId,
        });

        const msgnfts = await alchemy.nft.getNftsForOwner(msgaccount);
        console.log(msgnfts);
        console.log(msgnfts.ownedNfts[0].image.originalUrl);

        skillList.push({
          tokenID: nfts.ownedNfts[i].tokenId,
          name: nfts.ownedNfts[i].name,
          description: nfts.ownedNfts[i].description,
          image: nfts.ownedNfts[i].image.originalUrl,
          couponID: msgnfts.ownedNfts[0].tokenId,
          couponURI: msgnfts.ownedNfts[0].image.originalUrl,
        });
      }
      console.log(skillList);
      setSkills(skillList);
    };
    init();
  }, []);
  return (
    <div className="flex">
      <LazyMotion features={domAnimation} strict>
        {skills.length == 0 && (
          <m.div
            initial={{ scale: 0.8 }}
            animate={{
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
            style={{ zIndex: 1, transition: "all 0.6s" }}
            className="card w-[300px] h-[350px] flex flex-col items-center  bg-primary-400 rounded-xl border-4 border-primary-600 cursor-pointer"
          >
            <div className="w-full h-[80px] flex items-center gap-2 p-1 flex-col">
              {/* <img
                className="h-[50px] flex justify-center items-center w-[50px]  bg-primary-600 rounded-[50%] p-1 object-contain"
                src="https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Christmas-PNG/Decorative_Christmas_Tree_PNG_Clip_Art.png?m=1540252135"
                alt="Christmas Tree"
              />
              <span
                className="text-xl"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "bold",
                }}
              >
                Name
              </span>
              <img
                className="w-28 flex justify-center items-center  bg-primary-600 rounded-[50%] p-1 object-contain"
                src="https://cdn-icons-png.flaticon.com/512/6262/6262035.png"
                alt="Christmas Tree"
              />
              <span
                className="text-center bg-primary-400 text-grayscale-950 rounded-xl text-sm p-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "400",
                }}
              >
                Description
              </span> */}

              <img
                src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/6a3edb109253591.5fcfbcdd1504b.gif"
                alt=""
              />
              <span
                className="text-center bg-primary-400 text-grayscale-950 rounded-xl text-sm p-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "400",
                }}
              >
                Secret Santa Gifts Are On The Way
              </span>
            </div>
          </m.div>
        )}
        {skills.map((skill, index) => (
          <m.div
            initial={{ scale: 0.8 }}
            animate={{
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
            style={{ zIndex: `${index + 1}`, transition: "all 0.6s" }}
            key={index}
            className="card w-[300px] h-[380px] flex flex-col items-center  bg-primary-400 rounded-xl border-4 border-primary-600 cursor-pointer"
          >
            <div className="w-full h-[60px] flex items-center gap-2 p-1 flex-col">
              <button
                role="link"
                onClick={() =>
                  openInNewTab(
                    `https://testnets.opensea.io/assets/mumbai/${MESSAGEADDRESS}/${skill.tokenID}`
                  )
                }
              >
                <img
                  className="h-[120px] flex justify-center items-center w-[120px]  bg-primary-600 rounded-[50%] p-1 object-contain"
                  src={skill.image}
                  alt=""
                />
              </button>
              <span
                className="text-xl"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "bold",
                }}
              >
                {skill.name}
              </span>
              <button
                role="link"
                onClick={() =>
                  openInNewTab(
                    `https://testnets.opensea.io/assets/mumbai/0x5256A67D9d7905471623A943b0A573AF492fb8e8/${skill.couponID}`
                  )
                }
              >
                <img
                  className="w-28 flex justify-center items-center rounded-[20%] bg-primary-600  p-1 object-contain"
                  src={skill.couponURI}
                  alt="Christmas Tree"
                />
              </button>
              <span
                className="text-center bg-primary-400 text-grayscale-950 rounded-xl text-sm p-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "400",
                }}
              >
                {skill.description}
              </span>
            </div>
          </m.div>
        ))}
      </LazyMotion>
    </div>
  );
};

export default SkillsCards;
