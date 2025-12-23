import trophySuperligaItaloEspañola from 'images/superliga-italo-española.png'
import trophySuperligaArgentina from 'images/superliga-argentina.png'
import trophySuperligaEuropea from 'images/superliga-europea.png'
import trophyMundialDeClubes from 'images/mundial-de-clubes.png'
import trophyTorneoArgentino from 'images/torneo-argentino.png'
import trophyCopaArgentina from 'images/copa-argentina.png'
import trophySuperligaInglesa from 'images/superliga-inglesa.png'
import trophyCopaAmerica from 'images/copa-america.png'
import trophyChampions from 'images/champions.png'
import trophyWorldCup from 'images/world-cup.png'
import trophyFerraris from 'images/ferraris.png'
import { StyledAccolades } from './styled'
import PlayerBox from '../PlayerBox'

const Accolades = () => {
  return (
    <>
      <StyledAccolades>
        <PlayerBox
          player={'Leo'}
          trophies={[
            trophyWorldCup,
            trophyTorneoArgentino,
            trophyWorldCup,
            trophyChampions,
            trophyTorneoArgentino,
            trophyWorldCup,
            trophySuperligaItaloEspañola,
            trophyFerraris,
          ]}
        />
        <PlayerBox
          player={'Max'}
          trophies={[
            trophyTorneoArgentino,
            trophyTorneoArgentino,
            trophyWorldCup,
            trophyMundialDeClubes,
            trophyCopaArgentina,
            trophySuperligaArgentina,
          ]}
        />
        <PlayerBox
          player={'Nico'}
          trophies={[
            trophySuperligaEuropea,
            trophySuperligaInglesa,
            trophySuperligaInglesa,
          ]}
        />
        <PlayerBox player={'Santi'} trophies={[trophyCopaAmerica]} />
      </StyledAccolades>
    </>
  )
}

export default Accolades
