import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { TournamentProvider } from "./context/TournamentContext";
import { LoginProvider } from "./context/LoginContext";
import Navbar from "./components/Navbar";
import AnimatedRoutes from "./routes/AnimatedRoutes";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <LoginProvider>
        <Navbar />
        <TournamentProvider>
          <AnimatedRoutes />
        </TournamentProvider>
      </LoginProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
