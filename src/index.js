import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./views/containers/Header/Navbar";
import StandingsTable from "./pages/standings/components/StandingsTable";
import Matches from "./pages/matches";
import Tournaments from "./pages/tournaments";
import FixtureId from "./pages/fixture-id";
import Statistics from "./pages/statistics";
import { TournamentProvider } from "./context/TournamentContext";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <TournamentProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/standings" element={<StandingsTable />} />
          <Route path="/tournaments">
            <Route index element={<Tournaments />} />
            <Route path=":id" element={
              <main style={{ padding: "1rem" }}>
                <p>Aquí habrá info de un torneo en particular</p>
              </main>
            } />
            <Route path=":id/fixture" element={<FixtureId />} />
          </Route>
          <Route path="/matches" element={<Matches />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="*" element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
          />
        </Routes>
      </TournamentProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
