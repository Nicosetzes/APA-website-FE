import { StyledAccolades } from './styled'
import PlayerBox from '../PlayerBox'
import trophyChampions from './../../../../images/champions.png'
import trophyCopaAmerica from './../../../../images/copa-america.png'
import trophyCopaArgentina from './../../../../images/copa-argentina.png'
import trophyMundialDeClubes from './../../../../images/mundial-de-clubes.png'
import trophyPremierLeague from './../../../../images/premier-league.png'
import trophyRandomOne from './../../../../images/random-one.png'
import trophySuperligaArgentina from './../../../../images/superliga-argentina.png'
import trophyWorldCup from './../../../../images/world-cup.png'

const Accolades = () => {
  return (
    <>
      <StyledAccolades>
        <PlayerBox
          player={'Max'}
          trophies={[
            trophySuperligaArgentina,
            trophySuperligaArgentina,
            trophyWorldCup,
            trophyMundialDeClubes,
            trophyCopaArgentina,
          ]}
        />
        <PlayerBox
          player={'Leo'}
          trophies={[
            trophyWorldCup,
            trophySuperligaArgentina,
            trophyWorldCup,
            trophyChampions,
            trophySuperligaArgentina,
          ]}
        />
        <PlayerBox player={'Santi'} trophies={[trophyCopaAmerica]} />
        <PlayerBox player={'Lucho'} />
        <PlayerBox
          player={'Nico'}
          trophies={[trophyRandomOne, trophyPremierLeague]}
        />
      </StyledAccolades>
    </>
  )
}

export default Accolades
