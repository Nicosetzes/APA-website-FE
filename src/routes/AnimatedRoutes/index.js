import { AnimatePresence } from 'framer-motion'
import ProtectedRoute from '../ProtectedRoute'
import { ROUTES } from '../routesConfig'
import TournamentLayout from 'pages/tournament-id/TournamentLayout'
import {
  Calculator,
  CreateTournament,
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
  TournamentId,
  Tournaments,
} from 'pages'
import { Edits, EditsUpload, StatisticsGeneral } from 'views/containers'
import { Route, Routes, useLocation } from 'react-router-dom'

export const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence>
      <Routes location={location}>
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
          <Route path=":tournament" element={<TournamentLayout />}>
            <Route index element={<TournamentId />} />
            <Route path="fixture" element={<FixtureId />} />
            <Route path="standings" element={<Standings />} />
            <Route
              path="simulator"
              element={
                <ProtectedRoute>
                  <Simulator />
                </ProtectedRoute>
              }
            />
            <Route
              path="simulator/calculator"
              element={
                <ProtectedRoute>
                  <Calculator />
                </ProtectedRoute>
              }
            />
            <Route path="playin" element={<Playin />} />
            <Route path="playoffs" element={<Playoffs />} />
            <Route path="stats" element={<Players />} />
          </Route>
        </Route>

        <Route path={ROUTES.MATCHES.path} element={<Matches />} />
        <Route path={ROUTES.STATISTICS.path} element={<StatisticsGeneral />} />
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
