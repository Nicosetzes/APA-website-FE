import Accolades from './components/Accolades'
import Showcase from './components/Showcase'
import { Loader } from 'views/components'
import { apiClient, getApiErrorMessage } from 'api/axiosConfig'
import { useEffect, useState } from 'react'
import { StyledHallOfFame } from './styled'

const isAbortError = (error) =>
  error?.name === 'CanceledError' || error?.name === 'AbortError'

const HallOfFame = () => {
  const [tournaments, setTournaments] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    apiClient
      .get('/tournaments', {
        params: { status: 'finalized' },
        signal: controller.signal,
      })
      .then(({ data }) => {
        setTournaments(data)
        setError(null)
      })
      .catch((requestError) => {
        if (isAbortError(requestError)) return
        setError(
          getApiErrorMessage(requestError, 'No se pudieron cargar los torneos'),
        )
      })

    return () => controller.abort()
  }, [])

  if (error) {
    return (
      <StyledHallOfFame>
        <div className="hall-of-fame__message">{error}</div>
      </StyledHallOfFame>
    )
  }

  if (!tournaments) {
    return (
      <StyledHallOfFame>
        <div className="hall-of-fame__loader">
          <Loader />
        </div>
      </StyledHallOfFame>
    )
  }

  return (
    <StyledHallOfFame>
      <Showcase tournaments={tournaments} />
      <Accolades tournaments={tournaments} />
    </StyledHallOfFame>
  )
}

export default HallOfFame
