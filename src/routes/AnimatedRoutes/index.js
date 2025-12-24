import { AnimatePresence } from 'framer-motion'
import ProtectedRoute from '../ProtectedRoute'
import { ROUTES } from '../routesConfig'
import {
  Calculator,
  CreateTournament,
  Edits,
  EditsUpload,
  FixtureId,
  HallOfFame,
  Home,
  Login,
  Matches,
  Players,
  Playin,
  Playoffs,
  Simulator,
  Standings,
  Statistics,
  Teams,
  TournamentId,
  Tournaments,
} from 'pages'
import { Route, Routes, useLocation } from 'react-router-dom'

export const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path={ROUTES.HOME.path} element={<Home />} />
        <Route path={ROUTES.LOGIN.path} element={<Login />} />

        <Route path="/tournaments">
          <Route index element={<Tournaments />} />
          <Route
            path="create-tournament"
            element={
              <ProtectedRoute
                requiredRole={ROUTES.CREATE_TOURNAMENT.requiredRole}
              >
                <CreateTournament />
              </ProtectedRoute>
            }
          />
          <Route path=":tournament" element={<TournamentId />} />
          <Route path=":tournament/fixture" element={<FixtureId />} />
          <Route path=":tournament/standings" element={<Standings />} />
          <Route
            path=":tournament/simulator"
            element={
              <ProtectedRoute>
                <Simulator />
              </ProtectedRoute>
            }
          />
          <Route
            path=":tournament/simulator/calculator"
            element={
              <ProtectedRoute>
                <Calculator />
              </ProtectedRoute>
            }
          />
          <Route path=":tournament/playin" element={<Playin />} />
          <Route path=":tournament/playoffs" element={<Playoffs />} />
          <Route path=":tournament/players" element={<Players />} />
          <Route path=":tournament/teams" element={<Teams />} />
        </Route>

        <Route path={ROUTES.MATCHES.path} element={<Matches />} />
        <Route path={ROUTES.STATISTICS.path} element={<Statistics />} />
        <Route path={ROUTES.HALL_OF_FAME.path} element={<HallOfFame />} />

        <Route path="/edits">
          <Route index element={<Edits />} />
          <Route
            path="upload"
            element={
              <ProtectedRoute requiredRole={ROUTES.EDITS_UPLOAD.requiredRole}>
                <EditsUpload />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 fallback */}
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
