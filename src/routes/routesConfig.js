export const ROUTES = {
  HOME: {
    path: '/',
    isPublic: true,
  },
  LOGIN: {
    path: '/users/login',
    isPublic: true,
  },

  TOURNAMENTS: {
    path: '/tournaments',
    isPublic: true,
  },
  CREATE_TOURNAMENT: {
    path: '/tournaments/create-tournament',
    isPublic: false,
  },
  TOURNAMENT_DETAIL: {
    path: '/tournaments/:tournament',
    isPublic: true,
  },
  TOURNAMENT_FIXTURE: {
    path: '/tournaments/:tournament/fixture',
    isPublic: true,
  },
  TOURNAMENT_STANDINGS: {
    path: '/tournaments/:tournament/standings',
    isPublic: true,
  },
  TOURNAMENT_SIMULATOR: {
    path: '/tournaments/:tournament/simulator',
    isPublic: false,
  },
  TOURNAMENT_CALCULATOR: {
    path: '/tournaments/:tournament/simulator/calculator',
    isPublic: false,
  },
  TOURNAMENT_PLAYIN: {
    path: '/tournaments/:tournament/playin',
    isPublic: true,
  },
  TOURNAMENT_PLAYOFFS: {
    path: '/tournaments/:tournament/playoffs',
    isPublic: true,
  },
  TOURNAMENT_PLAYERS: {
    path: '/tournaments/:tournament/players',
    isPublic: true,
  },
  TOURNAMENT_TEAMS: {
    path: '/tournaments/:tournament/teams',
    isPublic: true,
  },

  MATCHES: {
    path: '/matches',
    isPublic: true,
  },
  STATISTICS: {
    path: '/statistics',
    isPublic: true,
  },
  HALL_OF_FAME: {
    path: '/hall-of-fame',
    isPublic: true,
  },
  EDITS: {
    path: '/edits',
    isPublic: true,
  },
  EDITS_UPLOAD: {
    path: '/edits/upload',
    isPublic: false,
  },
}

export const getRoutePath = (routeKey, params = {}) => {
  let path = ROUTES[routeKey]?.path
  if (!path) return '/'

  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value)
  })

  return path
}
