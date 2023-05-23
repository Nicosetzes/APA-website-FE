import { StyledChampionshipBox } from './styled'
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

const ChampionshipBox = ({
  tournament,
  championUser,
  championTeam,
  championLogo,
  finalistUser,
  finalistTeam,
  finalistLogo,
  national,
  trophy,
  id,
}) => {
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 600px)' })
  const isXS = useMediaQuery({ query: '(min-width: 400px)' })

  return (
    <>
      <StyledChampionshipBox style={{ width: !isSm && '350px' }}>
        {id ? (
          <Link to={`/tournaments/${id}`}>
            <div className="showcase__header">
              <div className="showcase__header-title">{tournament}</div>
            </div>
            <div
              className="showcase__body"
              style={{ justifyContent: !isSm && 'center' }}
            >
              <div
                className="showcase__body-results"
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div className="showcase__body-champion">
                  <img src={championLogo} alt={championTeam} />
                  <div className="showcase__body-info">
                    <div className="showcase__body-info-title">Campeón</div>
                    <div className="showcase__body-info-team">
                      {championTeam}
                    </div>
                    <div className="showcase__body-info-user">
                      {championUser}
                    </div>
                  </div>
                  <div className="circle circle-champion circle-top-right"></div>
                  <div className="circle circle-champion circle-bottom-right"></div>
                  <div className="circle circle-champion circle-bottom-left"></div>
                  <div className="circle  circle-champion circle-top-left"></div>
                </div>
                <div className="showcase__body-finalist">
                  <img src={finalistLogo} alt={finalistTeam} />
                  <div className="showcase__body-info">
                    <div className="showcase__body-info-title">Subcampeón</div>
                    <div className="showcase__body-info-team">
                      {finalistTeam}
                    </div>
                    <div className="showcase__body-info-user">
                      {finalistUser}
                    </div>
                  </div>
                  <div className="circle circle-finalist circle-top-right"></div>
                  <div className="circle circle-finalist circle-bottom-right"></div>
                  <div className="circle circle-finalist circle-bottom-left"></div>
                  <div className="circle  circle-finalist circle-top-left"></div>
                </div>
              </div>
              {isSm && (
                <div
                  className="showcase__body-trophy"
                  style={{
                    display: 'flex',
                    outline: '#0d8499 3px solid',
                    width: '215px',
                  }}
                >
                  <img
                    src={trophy}
                    style={{ height: '300px', margin: 'auto 0' }}
                  />
                </div>
              )}
            </div>
          </Link>
        ) : (
          <>
            <div className="showcase__header">
              <div className="showcase__header-title">{tournament}</div>
            </div>
            <div
              className="showcase__body"
              style={{ justifyContent: !isSm && 'center' }}
            >
              <div
                className="showcase__body-results"
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div className="showcase__body-champion">
                  <img src={championLogo} alt={championTeam} />
                  <div className="showcase__body-info">
                    <div className="showcase__body-info-title">Campeón</div>
                    <div className="showcase__body-info-team">
                      {championTeam}
                    </div>
                    <div className="showcase__body-info-user">
                      {championUser}
                    </div>
                  </div>
                  <div className="circle circle-champion circle-top-right"></div>
                  <div className="circle circle-champion circle-bottom-right"></div>
                  <div className="circle circle-champion circle-bottom-left"></div>
                  <div className="circle  circle-champion circle-top-left"></div>
                </div>
                <div className="showcase__body-finalist">
                  <img src={finalistLogo} alt={finalistTeam} />
                  <div className="showcase__body-info">
                    <div className="showcase__body-info-title">Subcampeón</div>
                    <div className="showcase__body-info-team">
                      {finalistTeam}
                    </div>
                    <div className="showcase__body-info-user">
                      {finalistUser}
                    </div>
                  </div>
                  <div className="circle circle-finalist circle-top-right"></div>
                  <div className="circle circle-finalist circle-bottom-right"></div>
                  <div className="circle circle-finalist circle-bottom-left"></div>
                  <div className="circle  circle-finalist circle-top-left"></div>
                </div>
              </div>
              {isSm && (
                <div className="showcase__body-trophy">
                  <img src={trophy} />
                </div>
              )}
            </div>{' '}
          </>
        )}
      </StyledChampionshipBox>
    </>
  )
}

export default ChampionshipBox
