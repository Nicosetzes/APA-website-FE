import { useState } from 'react'
import { StyledRadio } from './styled'

const Radio = ({ id, value, checked, img, label, ...props }) => {
  const defaultChecked = checked ? checked : false
  const [isChecked, setIsChecked] = useState(defaultChecked)

  return (
    <StyledRadio>
      {img && <img src={img} />}
      <label htmlFor={`custom-radio-${id}`}>{label}</label>
      <input
        id={id}
        value={value}
        name={name}
        img={img}
        type="radio"
        checked={isChecked}
        onChange={() => setIsChecked((prev) => !prev)}
        {...props}
      />
      {/* <p>{isChecked ? 'Selected' : 'Unchecked'}</p> */}
    </StyledRadio>
  )
}

export default Radio
