import TagTeamsGenerator from '../../pages/tag-teams-generator'
import { Routes, Route, useLocation } from 'react-router-dom'
import RetrievePassword from '../../pages/retrieve-password'
import CreateTournament from '../../pages/create-tournament'
import TournamentId from './../../pages/tournament-id'
import Tournaments from './../../pages/tournaments'
import Statistics from './../../pages/statistics'
import HallOfFame from '../../pages/hall-of-fame'
import FixtureId from './../../pages/fixture-id'
import Standings from './../../pages/standings'
import Simulator from './../../pages/simulator'
import Calculator from '../../pages/calculator'
import { AnimatePresence } from 'framer-motion'
import Playoffs from '../../pages/playoffs'
import Players from './../../pages/players'
import Matches from './../../pages/matches'
import Login from './../../pages/login'
import Playin from '../../pages/playin'
import Teams from '../../pages/teams'
import App from './../../App'

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
          <Route
            path=":tournament/tag-teams-generator"
            element={<TagTeamsGenerator />}
          />
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
