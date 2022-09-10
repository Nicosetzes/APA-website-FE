import { useState, useEffect } from 'react'
import { api, database } from './../../api'
import axios from 'axios'
import CountryContainer from './components/CountryContainer'

const CreateTournament = () => {
  const [countries, setCountries] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${database}/leagues`)
      setCountries(res.data)
    }
    fetchData()
  }, [])

  return (
    <>
      <div>Crear torneo</div>
      {countries && <CountryContainer countries={countries} />}
    </>
  )
}

export default CreateTournament
