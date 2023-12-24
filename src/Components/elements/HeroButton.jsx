import React, { useState, useRef } from "react";
import { useIPFS } from "../helper/IPFS";
import { TokenboundClient } from "@tokenbound/sdk";
import detectEthereumProvider from "@metamask/detect-provider";
import { MESSAGEADDRESS, MESSAGEABI } from "../../Constants/message";
import { ethers } from "ethers";
import "./HeroButton.css";
import "./Form.css";

const HeroButton = () => {

  const { IPFSupload } = useIPFS();
  const inputFileRef = useRef(null);
  const [done, setDone] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [memory, setMemoryImage] = useState(null);
  const [sticker, setSticker] = useState(0);
  const [marketplace, setMarketplace] = useState(0);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(0);
  const [messageURI, setMessageURI] = useState("");

  const enterForm = async () => {
    setDone(true);
  };

  const secretSanta = async () => {
    setLoading(true);
    console.log(window.location.pathname);
    let tokenID = window.location.pathname;
    tokenID = tokenID.slice(1);
    console.log(tokenID);

    const ethereum = await window.ethereum;

    const signer = await new ethers.BrowserProvider(ethereum).getSigner();
    console.log(signer);

    const tokenboundClient = new TokenboundClient({
      signer, 
      chainId: 80001, 
      implementationAddress: '0xBf7F4beb68b960AE198a15f4f50247f4Fd20E21a',
      registryAddress: '0x284be69BaC8C983a749956D7320729EB24bc75f9',
    })

    const account = await tokenboundClient.getAccount({
      tokenContract: "0xb179B97FC6319173f3b199522Dabe69d60bce0Bf",
      tokenId: tokenID,
      implementationAddress: "0xBf7F4beb68b960AE198a15f4f50247f4Fd20E21a",
    });

    console.log(account);

    // MessageURI
    let msgURI = "https://ipfs.io/ipfs/" + messageURI.slice(7);
    console.log(msgURI)

    // Coupon
    let couponURI = "";
    if (coupon == 1) {
      couponURI =
        "https://ipfs.io/ipfs/bafkreifhodypv37tupmbkgzzhtfo3vrbyyw2p3snech72m5p25frpumdfu";
    } else if (coupon == 2) {
      couponURI =
        "https://ipfs.io/ipfs/bafkreigxwyww7soqp2lmoa4d4645jhyffotkbyi7frlcjh73kducyhpprq";
    } else if (coupon == 3) {
      couponURI =
        "https://ipfs.io/ipfs/bafkreihovgbgyoqtdjiyxmb6yxrsxc3k5lw2toz6o2c4afi5dasfpd6giq";
    } else if (coupon == 4) {
      couponURI =
        "https://ipfs.io/ipfs/bafkreihvpz2ny3xly3jibvd6v6rz5ijzs7qmlnofopbkoohgks2vxnrepm";
    }

    console.log(couponURI)

    const provider = await detectEthereumProvider({ silent: true });
    console.log(provider);

    const msg = new ethers.Contract(
      MESSAGEADDRESS,
      MESSAGEABI,
      signer
    );

    console.log("Account : " + account + "\n",
      "Message URI : " + msgURI + "\n",
      "CouponURI : " + couponURI+ "\n")

    const transaction = await msg.mintMessageWithGiftNFT(
      account,
      msgURI,
      couponURI,
      "0x284be69BaC8C983a749956D7320729EB24bc75f9",
      "0xBf7F4beb68b960AE198a15f4f50247f4Fd20E21a",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      80001
    );
    console.log(transaction);
    await transaction.wait();

    setLoading(false);
    setDone(false);
  };

  const enterMarketplace = async () => {
    const msgURI = await uploadMetadata(subject, message);
    setMessageURI(msgURI);
    setMarketplace(true);
  };

  function inputImageHandler(e) {
    inputFileRef.current.click();
    setMemoryImage(e.target.files[0]);
  }

  function selectStickerOne() {
    setSticker(1);
  }

  function selectStickerTwo() {
    setSticker(2);
  }

  function selectStickerThree() {
    setSticker(3);
  }

  function selectStickerFour() {
    setSticker(4);
  }

  async function getStickerOne() {
    const imageOriginUrl =
      "https://www.iconarchive.com/download/i8695/double-j-design/xmas-stickers/xmas-sticker-mistletoe.ico";
    const r = await fetch(imageOriginUrl);
    if (!r.ok) {
      throw new Error(`error fetching image: [${r.statusCode}]: ${r.status}`);
    }
    return r.blob();
  }

  async function getStickerTwo() {
    const imageOriginUrl =
      "https://www.iconarchive.com/download/i8693/double-j-design/xmas-stickers/xmas-sticker-reindeer.ico";
    const r = await fetch(imageOriginUrl);
    if (!r.ok) {
      throw new Error(`error fetching image: [${r.statusCode}]: ${r.status}`);
    }
    return r.blob();
  }

  async function getStickerThree() {
    const imageOriginUrl =
      "https://icons.iconarchive.com/icons/double-j-design/xmas-stickers/128/xmas-sticker-tree-icon.png";
    const r = await fetch(imageOriginUrl);
    if (!r.ok) {
      throw new Error(`error fetching image: [${r.statusCode}]: ${r.status}`);
    }
    return r.blob();
  }

  async function getStickerFour() {
    const imageOriginUrl =
      "https://www.iconarchive.com/download/i8698/double-j-design/xmas-stickers/xmas-sticker-snowman.128.png";
    const r = await fetch(imageOriginUrl);
    if (!r.ok) {
      throw new Error(`error fetching image: [${r.statusCode}]: ${r.status}`);
    }
    return r.blob();
  }

  const uploadMetadata = async () => {
    console.log("== Uploading Metadata == ");
    setLoading(true);
    let img;
    if (sticker == 1) {
      img = await getStickerOne();
    } else if (sticker == 2) {
      img = await getStickerTwo();
    } else if (sticker == 3) {
      img = await getStickerThree();
    } else if (sticker == 4) {
      img = await getStickerFour();
    } else {
      img = memory;
    }

    const metadataUrl = await IPFSupload(
      {
        name: subject,
        description: message,
      },
      img
    );

    console.log(metadataUrl);
    setLoading(false);

    return metadataUrl;
  };

  function selectBoat() {
    setCoupon(1);
    // setDone(false);
    console.log("Boat Coupon Selected");
  }

  function selectMamaEarth() {
    setCoupon(2);
    // setDone(false);
    console.log("Mama Earth Coupon Selected");
  }

  function selectSuperCoins() {
    setCoupon(3);
    // setDone(false);
    console.log("SuperCoins Coupon Selected");
  }

  function selectPoco() {
    setCoupon(4);
    // setDone(false);
    console.log("Poco Coupon Selected");
  }

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
      <>
        {window.location.pathname != "/" && (
          <>
            <div
              id="scroller"
              className="absolute xs:bottom-10 bottom-4 flex justify-center items-center"
            >
              <div className="w-[35-px] h-[64px] rounded-3xl border-4 border-primary-400 flex justify-center items-start p-2">
                <div>
                  <button class="btnn" onClick={enterForm}>
                    <i></i>🎄 Drop Message 🎄<i></i>
                  </button>
                </div>
              </div>

              {done && !marketplace && (
                <div
                  className="dropdown-backdrop min-w-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
                  id="modal-id"
                >
                  <div class="container w-[450px]">
                    <div class="heading">YOUR MESSAGE</div>
                    <form class="form" action="">
                      <input
                        placeholder="Subject Line"
                        id="message"
                        name="message"
                        type="text"
                        class="input"
                        required=""
                        onChange={(e) => setSubject(e.target.value)}
                      />
                      <textarea
                        placeholder="Write your message here!"
                        id="message"
                        name="message"
                        type="text"
                        class="input"
                        required=""
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </form>
                    <div class="social-account-container">
                      <span class="title">
                        Attach a sticker or upload a memory from gallery
                      </span>
                      <div class="social-accounts">
                        <button
                          className={`social-button ${
                            sticker == 1 ? "bg-primary-400" : "bg-white"
                          }`}
                          onClick={selectStickerOne}
                        >
                          <img src="https://www.iconarchive.com/download/i8695/double-j-design/xmas-stickers/xmas-sticker-mistletoe.ico" />
                        </button>
                        <button
                          className={`social-button ${
                            sticker == 2 ? "bg-primary-400" : "bg-white"
                          }`}
                          onClick={selectStickerTwo}
                        >
                          <img src="https://www.iconarchive.com/download/i8693/double-j-design/xmas-stickers/xmas-sticker-reindeer.ico" />
                        </button>
                        <button
                          className={`social-button ${
                            sticker == 0 ? "bg-primary-400" : "bg-white"
                          }`}
                        >
                          <label>
                            <input
                              ref={inputFileRef}
                              type="file"
                              hidden
                              onChange={(e) => inputImageHandler(e)}
                            />
                            <img
                              className="rounded-full"
                              src="https://t4.ftcdn.net/jpg/02/17/88/73/360_F_217887350_mDfLv2ootQNeffWXT57VQr8OX7IvZKvB.jpg"
                            />
                          </label>
                        </button>
                        <button
                          className={`social-button ${
                            sticker == 3 ? "bg-primary-400" : "bg-white"
                          }`}
                          onClick={selectStickerThree}
                        >
                          <img src="https://icons.iconarchive.com/icons/double-j-design/xmas-stickers/128/xmas-sticker-tree-icon.png" />
                        </button>
                        <button
                          className={`social-button ${
                            sticker == 4 ? "bg-primary-400" : "bg-white"
                          }`}
                          onClick={selectStickerFour}
                        >
                          <img src="https://www.iconarchive.com/download/i8698/double-j-design/xmas-stickers/xmas-sticker-snowman.128.png" />
                        </button>
                      </div>
                    </div>
                    <button class="login-button" onClick={enterMarketplace}>
                      🎄 CLIP MESSAGE 🎄
                    </button>
                  </div>
                </div>
              )}

              {done && marketplace && (
                <div
                  className="dropdown-backdrop min-w-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
                  id="modal-id"
                >
                  <div className="container w-[450px]">
                    <div className="heading">WRAP A GIFT 🎁 ?</div>

                    <div className="flex grid-cols-2">
                      {/* <img className="rounded-lg h-32" src="https://images.squarespace-cdn.com/content/v1/52094b1be4b0f6f84d966b0f/1604518263825-SIY4XI0I3V8Q7ANGSXYO/blog-gift-guide-animation-no-title.gif" alt=""/> */}
                      <img
                        className="rounded-lg h-32 w-[100vh]"
                        src="src/assets/avatar/coupon.png"
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="grid grid-cols-2 grid-flow-rows gap-2">
                        <div>
                          <button onClick={selectBoat}>
                            <div
                              className={`flex items-center p-3 w-44 h-28 ${
                                coupon == 1 ? "bg-primary-400" : "bg-white"
                              } bg-white rounded-md shadow-lg`}
                            >
                              <section className="flex justify-center items-center w-14 h-14 rounded-full hover:cursor-pointer hover:scale-110 duration-300">
                                <img
                                  src="https://www.brandedcorporategift.com/ecommerce/upload/images/others/edit/boat-34-2023-05.webp"
                                  alt=""
                                />
                              </section>

                              <section className="block border-l border-gray-300 m-3">
                                <div className="pl-3">
                                  <h3 className="text-gray-600 font-semibold text-sm">
                                    Flat $5 OFF
                                  </h3>
                                  <h3 className="bg-clip-text text-transparent bg-gradient-to-l from-[#005BC4] to-[#27272A] text-xs flex">
                                    2 MATIC
                                  </h3>
                                </div>
                              </section>
                            </div>
                          </button>
                        </div>

                        <div>
                          <button onClick={selectMamaEarth}>
                            <div
                              className={`flex items-center p-3 w-44 h-28 ${
                                coupon == 2 ? "bg-primary-400" : "bg-white"
                              } bg-white rounded-md shadow-lg`}
                            >
                              <section className="flex justify-center items-center w-14 h-14 rounded-full hover:cursor-pointer hover:scale-110 duration-300">
                                <img
                                  src="https://images.mamaearth.in/catalog/product/_/o/_onion-oil-250ml__1.jpg?fit=contain&width=683"
                                  alt=""
                                />
                              </section>

                              <section className="block border-l border-gray-300 m-3">
                                <div className="pl-3">
                                  <h3 className="text-gray-600 font-semibold text-sm">
                                    Flat $5 OFF
                                  </h3>
                                  <h3 className="bg-clip-text text-transparent bg-gradient-to-l from-[#005BC4] to-[#27272A] text-xs">
                                    2 MATIC
                                  </h3>
                                </div>
                              </section>
                            </div>
                          </button>
                        </div>

                        <div>
                          <button onClick={selectSuperCoins}>
                            <div
                              className={`flex items-center p-3 w-44 h-28 ${
                                coupon == 3 ? "bg-primary-400" : "bg-white"
                              } bg-white rounded-md shadow-lg`}
                            >
                              <section className="flex justify-center items-center w-14 h-14 rounded-full hover:cursor-pointer hover:scale-110 duration-300">
                                <img
                                  src="https://mir-s3-cdn-cf.behance.net/projects/404/16cc38181287937.Y3JvcCw4MDgsNjMyLDAsMA.jpg"
                                  alt=""
                                />
                              </section>

                              <section className="block border-l border-gray-300 m-3">
                                <div className="pl-3">
                                  <h3 className="text-gray-600 font-semibold text-sm">
                                    50 Super Coins
                                  </h3>
                                  <h3 className="bg-clip-text text-transparent bg-gradient-to-l from-[#005BC4] to-[#27272A] text-xs">
                                    10 MATIC
                                  </h3>
                                </div>
                              </section>
                            </div>
                          </button>
                        </div>

                        <div>
                          <button onClick={selectPoco}>
                            <div
                              className={`flex items-center p-3 w-44 h-28 ${
                                coupon == 4 ? "bg-primary-400" : "bg-white"
                              } bg-white rounded-md shadow-lg`}
                            >
                              <section className="flex justify-center items-center w-14 h-14 rounded-full hover:cursor-pointer hover:scale-110 duration-300">
                                <img src="https://akm-img-a-in.tosshub.com/indiatoday/images/device/1683288291Poco-X4-Pro-5G-1-800x799_one_to_one.jpg?VersionId=nW9uuXZhngZYP1HsRqeY6TfzREDv9Mrv" />
                              </section>

                              <section className="block border-l border-gray-300 m-3">
                                <div className="pl-3">
                                  <h3 className="text-gray-600 font-semibold text-xs">
                                    FLAT $50 OFF
                                  </h3>
                                  <h3 className="bg-clip-text text-transparent bg-gradient-to-l from-[#005BC4] to-[#27272A] text-xs">
                                    20 MATIC
                                  </h3>
                                </div>
                              </section>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                    <button className="login-button" onClick={secretSanta}>
                      WRAP SECRET SANTA GIFT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </>
    );
  }
};

export default HeroButton;
