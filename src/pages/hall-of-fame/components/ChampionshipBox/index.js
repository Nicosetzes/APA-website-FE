import { cloudName, database } from '../../../../api'
import { StyledChampionshipBox } from './styled'
import { useMediaQuery } from 'react-responsive'
import { Image } from 'cloudinary-react'
import { useNavigate } from 'react-router-dom'

const ChampionshipBox = ({
  tournament,
  championUserName,
  championTeamId,
  championTeamName,
  finalistUserName,
  finalistTeamId,
  finalistTeamName,
  cloudinary_id,
  id,
}) => {
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 600px)' })
  const isXS = useMediaQuery({ query: '(min-width: 400px)' })

  const navigate = useNavigate()

  return (
    <>
      {id ? (
        <StyledChampionshipBox
          style={{
            maxWidth: !isSm ? '425px' : '575px',
            height: !isSm ? 'auto' : '410px',
          }}
          onClick={() => {
            navigate(`/tournaments/${id}`)
          }}
        >
          <div className="showcase__header">
            <div className="showcase__header-title">{tournament}</div>
          </div>
          <div className="showcase__body">
            <div className="showcase__body-results">
              <div className="showcase__body-champion">
                <img
                  src={`${database}/logos/small/${championTeamId}`}
                  alt={championTeamName}
                />
                <div className="showcase__body-info">
                  <div className="showcase__body-info-title">Campeón</div>
                  <div className="showcase__body-info-team">
                    {championTeamName}
                  </div>
                  <div className="showcase__body-info-user">
                    {championUserName}
                  </div>
                </div>
                <div className="circle circle-champion circle-top-right"></div>
                <div className="circle circle-champion circle-bottom-right"></div>
                <div className="circle circle-champion circle-bottom-left"></div>
                <div className="circle  circle-champion circle-top-left"></div>
              </div>
              <div className="showcase__body-finalist">
                <img
                  src={`${database}/logos/small/${finalistTeamId}`}
                  alt={finalistTeamName}
                />
                <div className="showcase__body-info">
                  <div className="showcase__body-info-title">Subcampeón</div>
                  <div className="showcase__body-info-team">
                    {finalistTeamName}
                  </div>
                  <div className="showcase__body-info-user">
                    {finalistUserName}
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
                <Image cloudName={cloudName} publicId={cloudinary_id} />
              </div>
            )}
          </div>
        </StyledChampionshipBox>
      ) : (
        <StyledChampionshipBox
          style={{
            maxWidth: !isSm ? '425px' : '575px',
            height: !isSm ? 'auto' : '410px',
          }}
        >
          <>
            <div className="showcase__header">
              <div className="showcase__header-title">{tournament}</div>
            </div>
            <div
              className="showcase__body"
              style={{ justifyContent: !isSm && 'center' }}
            >
              <div className="showcase__body-results">
                <div className="showcase__body-champion">
                  <img
                    src={`${database}/logos/small/${championTeamId}`}
                    alt={championTeamName}
                  />
                  <div className="showcase__body-info">
                    <div className="showcase__body-info-title">Campeón</div>
                    <div className="showcase__body-info-team">
                      {championTeamName}
                    </div>
                    <div className="showcase__body-info-user">
                      {championUserName}
                    </div>
                  </div>
                  <div className="circle circle-champion circle-top-right"></div>
                  <div className="circle circle-champion circle-bottom-right"></div>
                  <div className="circle circle-champion circle-bottom-left"></div>
                  <div className="circle circle-champion circle-top-left"></div>
                </div>
                <div className="showcase__body-finalist">
                  <img
                    src={`${database}/logos/small/${finalistTeamId}`}
                    alt={finalistTeamName}
                  />
                  <div className="showcase__body-info">
                    <div className="showcase__body-info-title">Subcampeón</div>
                    <div className="showcase__body-info-team">
                      {finalistTeamName}
                    </div>
                    <div className="showcase__body-info-user">
                      {finalistUserName}
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
                  <Image cloudName={cloudName} publicId={cloudinary_id} />
                </div>
              )}
            </div>
          </>
        </StyledChampionshipBox>
      )}
    </>
  )
}

export default ChampionshipBox
