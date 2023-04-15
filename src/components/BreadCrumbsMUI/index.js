import { Link } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { StyledBreadCrumbsMUI } from './styled'
import EastIcon from '@mui/icons-material/East'
import SouthIcon from '@mui/icons-material/South'

const BreadCrumbsMUI = ({ links }) => {
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 576px)' })

  return (
    <StyledBreadCrumbsMUI
      separator={
        isM ? <EastIcon fontSize="small" /> : <SouthIcon fontSize="small" />
      }
      aria-label="breadcrumb"
      direction={isM ? 'row' : 'column'}
    >
      {links.map(({ name, route }, index) => (
        <Link key={index} to={`/${route}`}>
          {name}
        </Link>
      ))}
    </StyledBreadCrumbsMUI>
  )
}

export default BreadCrumbsMUI
