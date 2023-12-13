import { StyledAccolades } from './styled'
import PlayerBox from '../PlayerBox'
import trophyChampions from './../../../../images/champions.png'
import trophyCopaAmerica from './../../../../images/copa-america.png'
import trophyCopaArgentina from './../../../../images/copa-argentina.png'
import trophyMundialDeClubes from './../../../../images/mundial-de-clubes.png'
import trophyPremierLeague from './../../../../images/premier-league.png'
import trophyRandomOne from './../../../../images/superliga-europea.png'
import trophyTorneoArgentino from './../../../../images/torneo-argentino.png'
import trophyWorldCup from './../../../../images/world-cup.png'
import trophySuperligaItaloEspañola from './../../../../images/superliga-italo-española.png'
import trophySuperligaArgentina from './../../../../images/superliga-argentina.png'

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
          trophies={[trophyRandomOne, trophyPremierLeague]}
        />
        <PlayerBox player={'Santi'} trophies={[trophyCopaAmerica]} />
        <PlayerBox player={'Lucho'} trophies={[]} />
      </StyledAccolades>
    </>
  )
}

export default Accolades
