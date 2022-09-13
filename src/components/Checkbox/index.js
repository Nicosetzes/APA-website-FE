import { useState } from 'react'
import { StyledCheckbox } from './styled'

const Checkbox = ({ id, value, name, checked, img, label, ...props }) => {
  const defaultChecked = checked ? checked : false
  const [isChecked, setIsChecked] = useState(defaultChecked)

  return (
    <StyledCheckbox>
      {img && <img src={img} />}
      <label htmlFor={`custom-checkbox-${id}`}>{label}</label>
      <input
        id={id}
        value={value}
        name={name}
        img={img}
        type="checkbox"
        checked={isChecked}
        onChange={() => setIsChecked((prev) => !prev)}
        {...props}
      />
      <p>{isChecked ? 'Selected' : 'Unchecked'}</p>
    </StyledCheckbox>
  )
}

export default Checkbox
