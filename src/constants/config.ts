import { http, createConfig } from 'wagmi'
import { opBNBTestnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [opBNBTestnet],
  connectors: [
    injected()
  ],
  transports: {
    [opBNBTestnet.id]: http(),
  },
})
