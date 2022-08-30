import Home from './pages/home'
import { StylesProvider } from '@mui/styles'

function App() {
  return (
    <StylesProvider injectFirst>
      <Home />
    </StylesProvider>
  )
}

export default App
