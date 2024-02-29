import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { WagmiProvider } from 'wagmi'
import { config } from '@/constants/config.ts'
import { theme } from '@/theme'
import RoutesContainer from './routes'
import '@/i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={new QueryClient() }>
          <RoutesContainer />
        </QueryClientProvider>
      </WagmiProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
