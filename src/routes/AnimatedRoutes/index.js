import App from './../../App'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Login from './../../pages/login'
import Standings from './../../pages/standings'
import Playoffs from '../../pages/playoffs'
import Matches from './../../pages/matches'
import Tournaments from './../../pages/tournaments'
import TournamentId from './../../pages/tournament-id'
import FixtureId from './../../pages/fixture-id'
import Statistics from './../../pages/statistics'
import CreateTournament from '../../pages/create-tournament'
import HallOfFame from '../../pages/hall-of-fame'
import WorldCup from '../../pages/world-cup'
import WorldCupStandings from '../../pages/world-cup-standings'
import WorldCupPlayoffs from '../../pages/world-cup-playoffs'
// import CreateGame from '../../pages/create-game'

export const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/tournaments">
          <Route index element={<Tournaments />} />
          <Route path="create-tournament" element={<CreateTournament />} />
          <Route path=":tournament" element={<TournamentId />} />
          {/* <Route path=":tournament/create-game" element={<CreateGame />} /> */}
          <Route path=":tournament/fixture" element={<FixtureId />} />
          <Route path=":tournament/standings" element={<Standings />} />
          <Route path=":tournament/playoffs" element={<Playoffs />} />
        </Route>
        <Route path="/world-cup" element={<WorldCup />} />
        <Route path="/world-cup/standings" element={<WorldCupStandings />} />
        <Route path="/world-cup/playoffs" element={<WorldCupPlayoffs />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/hall-of-fame" element={<HallOfFame />} />
        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes
