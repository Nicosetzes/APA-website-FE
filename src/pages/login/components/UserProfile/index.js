import { StyledUserProfile } from './styled'
import SignOut from './../SignOut'
import { api } from '../../../../api'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Oval } from 'react-loader-spinner'
import PlayerInformationModal from '../../../../components/PlayerInformationModal'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const UserProfile = ({ id }) => {
  const MySwal = withReactContent(Swal)

  const [userData, setUserData] = useState()

  const getUserData = () => {
    axios
      .get(`${api}/users/profile?id=${id}`)
      .then(({ data }) => setUserData(data))
  }

  useEffect(() => {
    getUserData()
  }, [])

  const displayPlayerInformationModal = (name, stats) => {
    MySwal.fire({
      background: 'rgba(0,74,121,0.8)',
      html: <PlayerInformationModal name={name} stats={stats} />,
      width: 600,
      showConfirmButton: false,
      showCloseButton: true,
    })
  }

  if (userData) {
    const { user, stats } = userData

    return (
      <>
        <StyledUserProfile>
          <button
            className="button-display-statistics"
            onClick={() => displayPlayerInformationModal(user.nickname, stats)}
          >
            Ver estadísticas
          </button>
          <SignOut />
        </StyledUserProfile>
      </>
    )
  } else {
    return (
      <div style={{ margin: 'auto', width: '100px' }}>
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
    )
  }
}

export default UserProfile
