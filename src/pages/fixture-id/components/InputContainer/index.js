import axios from "axios";
import { useParams } from "react-router-dom";
import { useTournament } from "./../../../../context/TournamentContext";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

const InputContainer = ({ isFinished, matchId }) => {
  const api = "http://localhost:5000/api";

  const { id } = useParams();

  const tournament = useTournament();

  const deleteMatch = async () => {
    Swal.fire({
      title: "Eliminar",
      html: `¿Está seguro que desea eliminar este partido?`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Volver",
    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire(
        // 	'Eliminado!',
        // 	'El partido ha sido eliminado de la base de datos.',
        // 	'success'
        // );
        axios
          .delete(`${api}/tournaments/${id}/delete-game/${matchId}`)
          .then((response) => {
            // let {isDeleted} = response.data; // Podría usarlo para alertar un error al modificar
            let { updatedTournament } = response.data;
            tournament.updateTournament(updatedTournament);
            window.location.reload(); // REVISAR //
          });
      }
    });
  };

  if (!isFinished) {
    return (
      <div className="input__container">
        <IconButton type="submit" aria-label="delete" color="success">
          <CheckIcon />
        </IconButton>
      </div>
    );
  } else {
    return (
      <div className="input__container">
        <IconButton type="submit" aria-label="edit" color="warning">
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => deleteMatch}
          aria-label="delete"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </div>
    );
  }
};

export default InputContainer;
