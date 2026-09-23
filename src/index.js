import './index.css'
import AnimatedRoutes from 'routes/AnimatedRoutes'
import { AuthProvider } from 'context/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'
import reportWebVitals from './reportWebVitals'
import { Navbar, Footer, PageWrapper } from 'views/components'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <PageWrapper>
          <AnimatedRoutes />
        </PageWrapper>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
