import { StyledAccolades } from './styled'
import PlayerBox from '../PlayerBox'
import trophyChampions from './../../../../images/champions.png'
import trophyCopaAmerica from './../../../../images/copa-america.png'
import trophyCopaArgentina from './../../../../images/copa-argentina.png'
import trophyMundialDeClubes from './../../../../images/mundial-de-clubes.png'
import trophyPremierLeague from './../../../../images/premier-league.png'
import trophyRandomOne from './../../../../images/superliga-europea.png'
import trophySuperligaArgentina from './../../../../images/superliga-argentina.png'
import trophyWorldCup from './../../../../images/world-cup.png'

const Accolades = () => {
  return (
    <>
      <StyledAccolades>
        <PlayerBox
          player={'Leo'}
          trophies={[
            trophyWorldCup,
            trophySuperligaArgentina,
            trophyWorldCup,
            trophyChampions,
            trophySuperligaArgentina,
            trophyWorldCup,
          ]}
        />
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
