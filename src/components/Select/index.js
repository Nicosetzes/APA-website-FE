import { useState } from 'react'
import { StyledSelect } from './styled'

const Select = ({ options }) => {
  const [selectedGroup, setSelectedGroup] = useState('A')

  return (
    <StyledSelect>
      <select
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
      >
        {options.map(({ name, value }) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </select>
    </StyledSelect>
  )
}

export default Select
