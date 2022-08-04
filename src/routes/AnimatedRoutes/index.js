import { Routes, Route, useLocation } from "react-router-dom";
import App from "./../../App"
import { AnimatePresence } from "framer-motion";
import StandingsTable from "./../../pages/standings";
import Matches from "./../../pages/matches";
import Tournaments from "./../../pages/tournaments";
import FixtureId from "./../../pages/fixture-id";
import Statistics from "./../../pages/statistics";

const AnimatedRoutes = () => {

	const location = useLocation();

	return (
		<AnimatePresence>
			<Routes location={location} key={location.pathname}>
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
		</AnimatePresence>
	)
}

export default AnimatedRoutes;



