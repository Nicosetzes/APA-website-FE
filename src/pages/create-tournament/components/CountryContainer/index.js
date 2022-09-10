import { useState } from 'react'
import { StyledForm } from './styled'
import TeamContainer from './../TeamContainer'
import { database } from './../../../../api'
import axios from 'axios'

const CountryContainer = ({ countries }) => {
  const [leagues, setLeagues] = useState([])
  const [teams, setTeams] = useState([])

  const firstDivisionTeams = countries.filter(
    (team) => team.division == 'first',
  )

  const secondDivisionTeams = countries.filter(
    (team) => team.division == 'second',
  )

  const [checkedFirstDivisionState, setCheckedFirstDivisionState] = useState(
    new Array(firstDivisionTeams.length).fill(false),
  )

  const [checkedSecondDivisionState, setCheckedSecondDivisionState] = useState(
    new Array(secondDivisionTeams.length).fill(false),
  )

  const handleFirstDivisionChange = (position) => {
    const updatedCheckedState = checkedFirstDivisionState.map((item, index) =>
      index === position ? !item : item,
    )

    setCheckedFirstDivisionState(updatedCheckedState)
  }

  const handleSecondDivisionChange = (position) => {
    const updatedCheckedState = checkedSecondDivisionState.map((item, index) =>
      index === position ? !item : item,
    )

    setCheckedSecondDivisionState(updatedCheckedState)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(checkedFirstDivisionState)
    console.log(checkedSecondDivisionState)

    checkedFirstDivisionState.forEach((state, index) => {
      if (state === true) {
        let { id } = firstDivisionTeams[index]
        leagues.push(id) // REVISAR
        // setLeagues((currentLeagues) => [
        //   ...currentLeagues,
        //   firstDivisionTeams[index].id,
        // ])
      }
    })

    checkedSecondDivisionState.forEach((state, index) => {
      if (state === true) {
        let { id } = secondDivisionTeams[index]
        leagues.push(id) // REVISAR
        // setLeagues((currentLeagues) => [
        //   ...currentLeagues,
        //   secondDivisionTeams[index].id,
        // ])
      }
    })

    leagues.forEach(async (id) => {
      let res = await axios.get(`${database}/leagues/${id}/teams`)
      setTeams((currentTeams) => [...currentTeams, res.data])
    })
  }

  const processTeams = (teams) => {
    const allTeams = teams.reduce((acc, curr) => {
      return acc.concat(curr)
    }, [])
    return allTeams
  }

  //   const handleAddFriend = () => {
  //     setFriends((prevFriends) => [
  //         ...prevFriends,
  //         {
  //             name: "Random Friend Name",
  //             age: 20, // Random age
  //         },
  //     ]);
  // };

  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <div className="form__first-division">
          <div className="header">Primera división</div>
          <div className="first-division__leagues">
            {countries
              .filter((item) => item.division == 'first')
              .map(({ id, name }, index) => (
                <div key={id}>
                  <input
                    type="checkbox"
                    id={`custom-checkbox-${index}`}
                    name={name}
                    value={name}
                    checked={checkedFirstDivisionState[index]}
                    onChange={() => handleFirstDivisionChange(index)}
                  />
                  <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
                </div>
              ))}
          </div>
        </div>
        <div className="form__second-division">
          <div className="header">Segunda división</div>
          <div className="second-division__leagues">
            {countries
              .filter((item) => item.division == 'second')
              .map(({ id, name }, index) => (
                <div key={id}>
                  <input
                    type="checkbox"
                    id={`custom-checkbox-${index}`}
                    name={name}
                    value={name}
                    checked={checkedSecondDivisionState[index]}
                    onChange={() => handleSecondDivisionChange(index)}
                  />
                  <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
                </div>
              ))}
          </div>
        </div>
        <input type="submit" className="form__submit" />
      </StyledForm>
      {teams.length && <TeamContainer teams={processTeams(teams)} />}
    </>
  )
}

export default CountryContainer
