import { StyledFixtureContainer } from "./styled"
import Match from "./components/Match";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useTournament } from "./../../context/TournamentContext";
import axios from "axios";
import Swal from "sweetalert2";
import 'animate.css';

const FixtureId = () => {

  const api = "http://localhost:5000/api"

  const { id } = useParams();

  const tournament = useTournament();

  console.log(tournament);

  // const [tournament, setTournament] = useState();

  useEffect(() => {
    const fetchData = async () => {
      console.log("Hago el fetch de data")
      const res = await axios.get(`${api}/tournaments/${id}/fixture`);
      tournament.updateTournament(res.data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let scoreP1FromInput = event.target[2].value;
    let scoreP2FromInput = event.target[3].value;
    if (!scoreP1FromInput.length || !scoreP2FromInput.length) {
      Swal.fire({
        title: 'Error!',
        html: `Uno de los resultados no fue cargado. <br>
						Intente nuevamente`,
        color: '#000',
        background: "rgb(240 240 245)",
        icon: 'error',
        confirmButtonText: 'Volver',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })
      return;
    }

    const scoreP1 = Number(scoreP1FromInput);
    const scoreP2 = Number(scoreP2FromInput);
    const playerP1 = event.target.getAttribute("data-player1");
    const playerP2 = event.target.getAttribute("data-player2");
    const teamP1 = event.target.getAttribute("data-team1");
    const teamP2 = event.target.getAttribute("data-team2");
    const matchId = event.target.getAttribute("data-id");

    const data = {
      playerP1,
      playerP2,
      scoreP1,
      scoreP2,
      teamP1,
      teamP2,
      matchId
    }

    if (!matchId) { // It's a POST request //
      axios.post(`${api}/tournaments/${id}/upload-game/`, data)
        .then((response) => {
          // let {isUpdated} = response.data; // Podría usarlo para alertar un error al modificar
          let { updatedTournament } = response.data;
          tournament.updateTournament(updatedTournament);
        })
    }

    if (matchId) {// It's a PUT request //
      axios.put(`${api}/tournaments/${id}/update-game/${matchId}`, data)
        .then((response) => {
          // let {isUpdated} = response.data; // Podría usarlo para alertar un error al modificar
          let { updatedTournament } = response.data;
          tournament.updateTournament(updatedTournament);
        })
    }
  }

  return (
    <>
      {tournament.tournament && <StyledFixtureContainer>
        {tournament.tournament && tournament.tournament.fixture.map((match, index) =>
          <Match key={index} match={match} handleSubmit={handleSubmit} />
        )}
      </StyledFixtureContainer>}
    </>
  );
}

export default FixtureId; 