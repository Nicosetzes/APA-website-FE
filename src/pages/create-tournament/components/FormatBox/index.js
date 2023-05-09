// import { useState } from 'react'
import { StyledFormatBox } from './styled'

const FormatBox = ({ title, format, img, handler }) => {
  return (
    <StyledFormatBox img={img} onClick={handler}>
      <div className="formats__box-title" title={title} format={format}>
        {/*  Debo pasarle la prop title para que funcione el onClick! */}
        <span>{format}</span>
      </div>
    </StyledFormatBox>
  )
}

export default FormatBox
