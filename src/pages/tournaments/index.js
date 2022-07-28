import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import logo1 from "./../../images/premier-league-background-1.jpg";
import logo2 from "./../../images/premier-league-background-2.jpg";

const Tournaments = () => {

  const api = "http://localhost:5000/api"

  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${api}/tournaments`);
      setTournaments(res.data);
    };
    fetchData();
  }, []);

  console.log(tournaments);

  return (
    <>
      <div className="cardContainer">
        {tournaments.map((tournament, index) =>
          <Card key={tournament._id} sx={{ maxWidth: 250, display: "flex", margin: "2rem auto" }}>
            <Link to={`/tournaments/${tournament._id}/fixture`}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="350"
                  image={index === 0 ? logo1 : logo2}
                  alt={`${tournament.name}`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: "center" }}>
                    {tournament.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Link>
          </Card>
        )
        }
      </div>
    </>
  );
}

export default Tournaments; 