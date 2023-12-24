import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "font-awesome/css/font-awesome.min.css";
import "../../public/Fonts/Morganite/morganiteFont.css";
import { IPFSContextProvider } from "../Components/helper/IPFS";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <IPFSContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </IPFSContextProvider>
  </React.StrictMode>
);
