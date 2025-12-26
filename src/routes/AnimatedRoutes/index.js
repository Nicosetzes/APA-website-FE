import { AnimatePresence } from 'framer-motion'
import ProtectedRoute from '../ProtectedRoute'
import { ROUTES } from '../routesConfig'
import { TournamentLayout } from 'views/containers/Tournament/layout'
import {
  Calculator,
  HallOfFame,
  Login,
  Matches,
  Players,
  Simulator,
} from 'pages'
import {
  EditListing,
  EditUpload,
  Home,
  Tournament,
  TournamentCreation,
  TournamentFixture,
  TournamentListing,
  TournamentPlayin,
  TournamentPlayoffs,
  TournamentStandings,
  StatisticsGeneral,
} from 'views/containers'
import { Route, Routes, useLocation } from 'react-router-dom'

export const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence>
      <Routes location={location}>
        <Route path={ROUTES.HOME.path} element={<Home />} />
        <Route path={ROUTES.LOGIN.path} element={<Login />} />

        <Route path="/tournaments">
          <Route index element={<TournamentListing />} />
          <Route
            path="create-tournament"
            element={
              <ProtectedRoute
                requiredRole={ROUTES.CREATE_TOURNAMENT.requiredRole}
              >
                <TournamentCreation />
              </ProtectedRoute>
            }
          />
          <Route path=":tournament" element={<TournamentLayout />}>
            <Route index element={<Tournament />} />
            <Route path="fixture" element={<TournamentFixture />} />
            <Route path="standings" element={<TournamentStandings />} />
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
            <Route path="playin" element={<TournamentPlayin />} />
            <Route path="playoffs" element={<TournamentPlayoffs />} />
            <Route path="stats" element={<Players />} />
          </Route>
        </Route>

        <Route path={ROUTES.MATCHES.path} element={<Matches />} />
        <Route path={ROUTES.STATISTICS.path} element={<StatisticsGeneral />} />
        <Route path={ROUTES.HALL_OF_FAME.path} element={<HallOfFame />} />

        <Route path="/edits">
          <Route index element={<EditListing />} />
          <Route
            path="upload"
            element={
              <ProtectedRoute requiredRole={ROUTES.EDITS_UPLOAD.requiredRole}>
                <EditUpload />
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
