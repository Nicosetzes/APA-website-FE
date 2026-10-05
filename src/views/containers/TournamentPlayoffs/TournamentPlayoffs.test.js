/* eslint-env jest */
let mockBracketProps
jest.mock('react-router-dom', () => ({
  useOutletContext: () => ({
    canMutate: true,
    tournamentData: {
      cloudinary_id: 'cup',
      format: 'playoff',
      playoffMode: 'two_legged',
    },
  }),
  useParams: () => ({ tournament: 'tournament' }),
}))
jest.mock('framer-motion', () => ({
  motion: { div: ({ children }) => <div>{children}</div> },
}))
jest.mock('views/components', () => ({
  PageLoader: () => <div>loading</div>,
  PlayoffBracket: (props) => {
    mockBracketProps = props
    return <div>bracket</div>
  },
  PrimaryLink: () => null,
  StandingsTable: () => null,
}))
jest.mock('api/axiosConfig', () => ({
  apiClient: { get: jest.fn(), post: jest.fn() },
  getApiErrorMessage: jest.fn(() => 'error'),
}))
jest.mock('utils/notifications', () => ({
  confirmDialog: jest.fn(),
  toast: { success: jest.fn(), apiError: jest.fn() },
}))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { apiClient } from 'api/axiosConfig'
import TournamentPlayoffs from '.'

test('returns the playoff refresh promise used by conflict handling', async () => {
  apiClient.get.mockResolvedValue({ data: { matches: [{ _id: 'match' }] } })
  const container = document.createElement('div')
  await act(async () => {
    ReactDOM.render(<TournamentPlayoffs />, container)
    await Promise.resolve()
  })
  expect(mockBracketProps).toBeDefined()

  let resolveRefresh
  const pendingRefresh = new Promise((resolve) => {
    resolveRefresh = resolve
  })
  apiClient.get.mockReturnValueOnce(pendingRefresh)
  const returned = mockBracketProps.getData()
  expect(returned).toBeInstanceOf(Promise)

  resolveRefresh({ data: { matches: [{ _id: 'fresh-match' }] } })
  await act(async () => returned)
  expect(mockBracketProps.matches[0]._id).toBe('fresh-match')
  ReactDOM.unmountComponentAtNode(container)
})
