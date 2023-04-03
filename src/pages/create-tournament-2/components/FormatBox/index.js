// import { useState } from 'react'
import { StyledFormatBox } from './styled'

const FormatBox = ({ title, img, handler }) => {
  return (
    <StyledFormatBox img={img} onClick={handler}>
      <div className="formats__box-title" title={title}>
        {/*  Debo pasarle la prop title para que funcione el onClick! */}
        <span>{title}</span>
      </div>
    </StyledFormatBox>
  )
}

export default FormatBox
