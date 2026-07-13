import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/lib/theme'
import { I18nProvider } from '@/lib/i18n'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
)
