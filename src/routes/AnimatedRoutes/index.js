import App from './../../App'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Login from './../../pages/login'
import RetrievePassword from '../../pages/retrieve-password'
import Standings from './../../pages/standings'
import Simulator from './../../pages/simulator'
import Calculator from '../../pages/calculator'
import Playin from '../../pages/playin'
import Playoffs from '../../pages/playoffs'
import Players from './../../pages/players'
import Matches from './../../pages/matches'
import Tournaments from './../../pages/tournaments'
import TournamentId from './../../pages/tournament-id'
import FixtureId from './../../pages/fixture-id'
import Statistics from './../../pages/statistics'
import CreateTournament from '../../pages/create-tournament'
import HallOfFame from '../../pages/hall-of-fame'
import Teams from '../../pages/teams'
import Lineup from './../../pages/lineup'

export const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/retrieve-password" element={<RetrievePassword />} />
        <Route path="/tournaments">
          <Route index element={<Tournaments />} />
          <Route path="create-tournament" element={<CreateTournament />} />
          <Route path=":tournament" element={<TournamentId />} />
          <Route path=":tournament/fixture" element={<FixtureId />} />
          <Route path=":tournament/standings" element={<Standings />} />
          <Route path=":tournament/simulator" element={<Simulator />} />
          <Route
            path=":tournament/simulator/calculator"
            element={<Calculator />}
          />
          <Route path=":tournament/playin" element={<Playin />} />
          <Route path=":tournament/playoffs" element={<Playoffs />} />
          <Route path=":tournament/players" element={<Players />} />
          <Route path=":tournament/teams" element={<Teams />} />
          <Route path=":tournament/teams/:team/squad" element={<Lineup />} />
        </Route>
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
