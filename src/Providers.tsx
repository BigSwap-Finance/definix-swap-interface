import React from 'react'
import { createCaverJsReactRoot, CaverJsReactProvider } from '@sixnetwork/caverjs-react-core'
import { KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { Provider } from 'react-redux'
import { ModalProvider } from 'definixswap-uikit-v2'
import { ModalProvider as OldModalProvider } from 'uikit-dev'
import { NetworkContextName } from './constants'
import store from './state'
import getLibrary from './utils/getLibrary'
import { ThemeContextProvider } from './ThemeContext'

const Web3ProviderNetwork = createCaverJsReactRoot(NetworkContextName)

const Providers: React.FC = ({ children }) => {
  const { setShowModal } = React.useContext(KlipModalContext())
  const onHiddenModal = () => {
    setShowModal(false)
  }
  window.onclick = (event) => {
    if (event.target === document.getElementById('customKlipModal')) {
      onHiddenModal()
    }
  }
  return (
    <Provider store={store}>
      {/* <UseWalletProvider
          chainId={parseInt(process.env.REACT_APP_CHAIN_ID)}
          connectors={{
            injected,
            klip: { showModal: onPresent, closeModal: onHiddenModal },
          }}
        > */}
        <CaverJsReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            {/* <Provider store={store}> */}
              <ThemeContextProvider>
                <OldModalProvider>
                  <ModalProvider>{children}</ModalProvider>
                </OldModalProvider>
              </ThemeContextProvider>
            {/* </Provider> */}
          </Web3ProviderNetwork>
        </CaverJsReactProvider>
      {/* </UseWalletProvider> */}
    </Provider>
  )
}

export default Providers
