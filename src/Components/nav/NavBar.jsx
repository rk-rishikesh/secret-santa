import React, { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { styles } from "../../styles.js";
import "./button.css";

const Navbar = () => {
  const [account, setAccount] = useState("");

  useEffect(() => {
    const checkAccount = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      console.log(provider);
      const ethereum = await window.ethereum;

      const signer = await new ethers.BrowserProvider(ethereum).getSigner();
      console.log(signer);

      setAccount(signer.address);
    };
    checkAccount();
  }, []);

  const handleConnect = async () => {
    let accounts = await window.ethereum?.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts[0]);
    setAccount(accounts[0]);
  };

  function truncateString(
    str,
    firstCharCount = str.length,
    endCharCount = 0,
    dotCount = 3
  ) {
    if (str.length <= firstCharCount + endCharCount) {
      return str; // No truncation needed
    }

    const firstPortion = str.slice(0, firstCharCount);
    const endPortion = str.slice(-endCharCount);
    const dots = ".".repeat(dotCount);

    return `${firstPortion}${dots}${endPortion}`;
  }

  function refreshPage() {
    setTimeout(()=>{
        window.location.reload(false);
    }, 500);
    console.log('page to reload')
}

  return (
    <nav
      className={`
      ${styles.paddingX} w-full flex items-center py-5
      fixed top-0 z-20 bg-primary
    `}
    >
      <div
        className="w-full h-full"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          backgroundImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent)",
        }}
      ></div>
      <div className="w-full flex justify-between items-center max-w-7x1 mx-auto">
        <Link to="/" onClick={refreshPage}>
          <img
            src="/santa-logo.png"
            alt="appLogo"
            className="w-18 h-9 object-contain"
          />
        </Link>
        <p
          className="text-white text-[18px] font-bold cursor-pointer flex"
          style={{ color: "#FFFFFF" }}
        >
          <button class="connectbutton" onClick={handleConnect}>
            {account == "" ? "Connect Wallet" : truncateString(account, 8, 3)}
          </button>
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
