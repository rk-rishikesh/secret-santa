import React, { useState, useEffect, useRef } from "react";
import { useIPFS } from "../helper/IPFS";
import {
  CHRISTMASTREEADDRESS,
  CHRISTMASTREEABI,
} from "../../Constants/christmasTree";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import { TwitterShareButton } from "react-share";
import "./HeroButton.css";
import "./CopyCard.css";

const HeroScroller = () => {
  const { IPFSupload } = useIPFS();
  const [exist, setExist] = useState(false);
  const [name, setName] = useState("");
  const [formStatus, setFormStatus] = useState(false); //false:closed true:open
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenID, setTokenID] = useState(0);

  useEffect(() => {
    const parseURL = async (url) => {
      const data = await fetch(url);
      const json = await data.json();
      console.log(json);
      return json;
    };

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
        console.log(true);
        setExist(true);
      }

      const tokenID = await tree.userTree(signer.address);
      setTokenID(tokenID);
      const uri = await tree.tokenURI(tokenID);
      const parsedTree = await parseURL(uri);
      console.log(parsedTree);
      console.log(parsedTree.description);
      setDescription(parsedTree.description);
    };

    checkHasTree();
  }, []);

  const openForm = async () => {
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

      let hasTree = false;

      if ((await tree.balanceOf(signer.address)) >= 1) {
        hasTree = true;
      }
      return hasTree;
    };

    const hasTree = await checkHasTree();

    if (hasTree) {
      setExist(true);
    } else {
      setFormStatus(true);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    let treeURI = await uploadMetadata(name, name + " Christmas Party");

    treeURI = "https://ipfs.io/ipfs/" + treeURI.slice(7);

    console.log(treeURI);

    const provider = await detectEthereumProvider({ silent: true });
    console.log(provider);
    const ethereum = await window.ethereum;

    const signer = await new ethers.BrowserProvider(ethereum).getSigner();
    console.log(signer.address);

    const tree = new ethers.Contract(
      CHRISTMASTREEADDRESS,
      CHRISTMASTREEABI,
      signer
    );

    console.log(await tree.balanceOf(signer.address));

    if ((await tree.balanceOf(signer.address)) <= 0) {
      const transaction = await tree.mintMyTree(
        signer.address,
        treeURI,
        "0x284be69BaC8C983a749956D7320729EB24bc75f9",
        "0xBf7F4beb68b960AE198a15f4f50247f4Fd20E21a",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        80001
      );
      console.log(transaction);
      await transaction.wait();
    }

    setLoading(false);
    setExist(true);
    setFormStatus(false);
  };

  async function getExampleImage() {
    const imageOriginUrl =
      "https://img.stablecog.com/insecure/1920w/aHR0cHM6Ly9iLnN0YWJsZWNvZy5jb20vZWYxMDIyYTgtZmZlNi00NjQzLTg5M2UtNWFmODUyZWU2MjQ0LmpwZWc.webp";
    const r = await fetch(imageOriginUrl);
    if (!r.ok) {
      throw new Error(`error fetching image: [${r.statusCode}]: ${r.status}`);
    }
    return r.blob();
  }

  const uploadMetadata = async (name, description) => {
    console.log("== Uploading Metadata == ");
    const img = await getExampleImage();
    const metadataUrl = await IPFSupload(
      {
        name: name,
        description: description,
      },
      img
    );
    console.log(metadataUrl);

    return metadataUrl;
  };

  if (loading) {
    return (
      <>
        <div
          className="dropdown-backdrop min-w-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
          id="modal-id"
        >
          <div class="container w-[450px]">
            <div className="bg-grayscale-950 flex items-center justify-center relative">
              <img
                src="https://cdn.pixabay.com/animation/2022/12/23/16/22/16-22-13-468_512.gif"
                alt=""
              />
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div
        id="scroller"
        className="absolute xs:bottom-10 bottom-12 flex justify-center items-center pb-16"
      >
        {exist && <img src="/xmastree.png" />}

        {!exist && (
          <div className="w-[35-px] h-[64px] rounded-3xl border-4 border-primary-400 flex justify-center items-start p-2">
            <div>
              <button class="btnn" onClick={openForm}>
                <i></i>🎄 Mint My Tree 🎄<i></i>
              </button>
            </div>
          </div>
        )}

        {formStatus && (
          <div
            className="dropdown-backdrop min-w-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
            id="modal-id"
          >
            <div class="container w-[450px]">
              <div class="heading">YOUR PROFILE NFT</div>
              <form class="form" action="">
                <input
                  placeholder="Enter Username"
                  id="username"
                  name="username"
                  type="text"
                  class="input"
                  required=""
                  onChange={(e) => setName(e.target.value)}
                />
              </form>
              <img
                className="mt-4 rounded-xl"
                src="/profileNFT.webp"
                alt="Christmas Tree"
              />
              <button class="login-button" onClick={handleCreate}>
                🎄 CREATE PARTY 🎄
              </button>
            </div>
          </div>
        )}
        <div
          id="scroller"
          className="absolute xs:bottom-10 bottom-12 flex justify-center items-center"
        >
          {exist && window.location.pathname == "/" && (
            <>
              {description == "" && (
                <button class="connectbutton relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px] bg-gradient-to-t from-[#8122b0] to-[#dc98fd] active:scale-95">
                  <span class="w-full h-full flex items-center gap-2 px-8 py-3 bg-[#B931FC] text-[#f1d5fe] rounded-[14px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc]">
                    Fetching Your Tree
                    <img
                      className="w-8"
                      src="https://cdn.freelogovectors.net/wp-content/uploads/2023/07/twitter-x-logo-freelogovectors.net_.png"
                      alt=""
                    />
                  </span>
                </button>
              )}
              {description != "" && (
                <TwitterShareButton
                  title={`Secret Santa the #web3 way 🎁\n\nI just minted my Christmas Tree NFT which is enabled with #ERC6551 and ready to receive your message NFT, drop your message and gifts on my Christmas Tree 🎄`}
                  url={`https://thesecretsantofweb3.vercel.app/${tokenID}`}
                >
                  <button class="connectbutton relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px] bg-gradient-to-t from-[#8122b0] to-[#dc98fd] active:scale-95">
                    <span class="w-full h-full flex items-center gap-2 px-8 py-3 bg-[#B931FC] text-[#f1d5fe] rounded-[14px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc]">
                      Share {description} on
                      <img
                        className="w-8"
                        src="https://cdn.freelogovectors.net/wp-content/uploads/2023/07/twitter-x-logo-freelogovectors.net_.png"
                        alt=""
                      />
                    </span>
                  </button>
                </TwitterShareButton>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
};

export default HeroScroller;
