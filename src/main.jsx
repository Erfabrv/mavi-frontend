import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MaviApp from './MaviApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MaviApp />
  </StrictMode>
)