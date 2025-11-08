import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { api } from './../../api'
import TableContainer from '@mui/material/TableContainer'
import Pagination from '@mui/material/Pagination'
import MatchesTable from './components/MatchesTable'
import Paper from '@mui/material/Paper'
import { motion } from 'framer-motion'
import PageLoader from '../../components/PageLoader'

const Matches = () => {
  // const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  const isXS = useMediaQuery({ query: '(min-width: 375px)' })

  const [searchParams, setSearchParams] = useSearchParams()

  const handlePageChange = (event, value) => {
    // Second param (value) is the page that's been clicked! //
    const team = searchParams.get('teamName')
    team
      ? setSearchParams({ page: Number(value) - 1, teamName: team })
      : setSearchParams({ page: Number(value) - 1 })
    // If I don't do it like this, the team and player params are erased //
  }

  const [teamName, setTeamName] = useState('')

  const handleTeamNameChange = (event) => {
    const page = searchParams.get('page')
    if (page && event.target.value.length > 2) setSearchParams({ page: 0 })
    setTeamName(event.target.value.toLowerCase())
  }

  const [data, setData] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const page = searchParams.get('page')
      if (!page && !teamName)
        axios
          .get(`${api}/matches`, {
            withCredentials: true,
            credentials: 'include',
          })
          .then(({ data }) => {
            setData(data)
          })
      else if (page && !teamName)
        axios
          .get(`${api}/matches?page=${page}`, {
            withCredentials: true,
            credentials: 'include',
          })
          .then(({ data }) => {
            setData(data)
          })
      else
        axios
          .get(`${api}/matches?page=${page}&teamName=${teamName}`, {
            withCredentials: true,
            credentials: 'include',
          })
          .then(({ data }) => {
            setData(data)
          })
    }
    if (teamName.length === 0 || teamName.length > 2) fetchData()
  }, [teamName, searchParams])

  if (data) {
    console.log(data)
    const { matches, totalPages } = data

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div style={{ padding: '2rem 0 0 0' }}>
          <span>Realizar búsqueda de partidos</span>
          <input
            className="search"
            placeholder="Equipo..."
            onChange={(e) => handleTeamNameChange(e)}
            style={{ margin: '1rem' }}
          />
          <TableContainer component={Paper} sx={{ padding: '3rem 0' }}>
            <MatchesTable matches={matches} />
          </TableContainer>
          <Pagination
            count={totalPages}
            page={Number(searchParams.get('page')) + 1}
            name={'page'}
            onChange={handlePageChange}
            variant="outlined"
            color="secondary"
            size={!isXS ? 'small' : 'medium'}
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '0.75rem 0.5rem',
            }}
          />
        </div>
      </motion.div>
    )
  } else {
    return <PageLoader />
  }
}

export default Matches
