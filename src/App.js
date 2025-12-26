import { Home } from './views/containers'
import { StylesProvider } from '@mui/styles'

function App() {
  return (
    <StylesProvider injectFirst>
      <Home />
    </StylesProvider>
  )
}

export default App
