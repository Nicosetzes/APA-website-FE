import { Oval } from 'react-loader-spinner'

const Loader = ({ color = '#09d514', height = 40, width = 40 }) => {
  return (
    <Oval
      ariaLabel="three-dots-loading"
      color={color}
      height={height}
      radius="9"
      width={width}
      $wrapperStyle
      $wrapperClass
    />
  )
}

export default Loader
