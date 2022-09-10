import App from './../../App'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Login from './../../pages/login'
import Standings from './../../pages/standings'
import Playoffs from '../../pages/playoffs'
import Matches from './../../pages/matches'
import Tournaments from './../../pages/tournaments'
import FixtureId from './../../pages/fixture-id'
import Statistics from './../../pages/statistics'
import CreateTournament from '../../pages/create-tournament'

export const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/playoffs" element={<Playoffs />} />
        <Route path="/tournaments">
          <Route index element={<Tournaments />} />
          <Route
            path=":id"
            element={
              <main style={{ padding: '1rem' }}>
                <p>Aquí habrá info de un torneo en particular</p>
              </main>
            }
          />
          <Route path=":id/fixture" element={<FixtureId />} />
        </Route>
        <Route path="/create-tournament" element={<CreateTournament />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/statistics" element={<Statistics />} />
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
