import { StyledAccolades } from './styled'
import PlayerBox from '../PlayerBox'

const Accolades = () => {
  return (
    <>
      <StyledAccolades>
        <PlayerBox
          player={'Leo'}
          trophies={[
            '/images/world-cup.png',
            '/images/torneo-argentino.png',
            '/images/world-cup.png',
            '/images/champions.png',
            '/images/torneo-argentino.png',
            '/images/world-cup.png',
            '/images/superliga-italo-española.png',
            '/images/ferraris.png',
          ]}
        />
        <PlayerBox
          player={'Max'}
          trophies={[
            '/images/torneo-argentino.png',
            '/images/torneo-argentino.png',
            '/images/world-cup.png',
            '/images/mundial-de-clubes.png',
            '/images/copa-argentina.png',
            '/images/superliga-argentina.png',
          ]}
        />
        <PlayerBox
          player={'Nico'}
          trophies={[
            '/images/superliga-europea.png',
            '/images/superliga-inglesa.png',
            '/images/superliga-inglesa.png',
            '/images/internacional_co4gg7.png',
          ]}
        />
        <PlayerBox player={'Santi'} trophies={['/images/copa-america.png']} />
      </StyledAccolades>
    </>
  )
}

export default Accolades
