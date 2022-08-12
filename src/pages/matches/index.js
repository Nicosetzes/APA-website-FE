import { useEffect, useState } from "react";
import axios from "axios";
import TableContainer from "@mui/material/TableContainer";
import MatchesTable from "./components/MatchesTable";
import Paper from "@mui/material/Paper";
import { motion } from "framer-motion";
import { Oval } from "react-loader-spinner";

const Matches = () => {
  const api = "http://localhost:5000/api";

  const [query, setQuery] = useState("");
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${api}/matches?query=${query}`);
      setData(res.data);
    };
    if (query.length === 0 || query.length > 2) fetchData();
  }, [query]);

  console.log(data);

  if (data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <input
          className="search"
          placeholder="Buscar..."
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
        />
        <TableContainer component={Paper}>
          <MatchesTable data={data} />
        </TableContainer>
      </motion.div>
    );
  } else {
    return (
      <div style={{ margin: "auto", width: "100px" }}>
        <Oval
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="three-dots-loading"
          $wrapperStyle
          $wrapperClass
        />
      </div>
    );
  }
};

export default Matches;
