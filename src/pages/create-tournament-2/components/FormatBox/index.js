import { useState } from 'react'
import { StyledFormatBox } from './styled'

const FormatBox = ({ title, img, handler }) => {
  return (
    <StyledFormatBox img={img} onClick={handler}>
      <div title={title}>
        <span className="formats__box-title">{title}</span>
      </div>
    </StyledFormatBox>
  )
}

export default FormatBox
