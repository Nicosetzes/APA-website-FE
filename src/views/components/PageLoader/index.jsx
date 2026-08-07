import { Loader } from 'views/components'
import { StyledPageLoader } from './styled'

const PageLoader = ({ color, height, width }) => {
  return (
    <StyledPageLoader>
      <Loader color={color} height={height} width={width} />
    </StyledPageLoader>
  )
}

export default PageLoader
