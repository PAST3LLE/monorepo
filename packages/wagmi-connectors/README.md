<img width="438" alt="image" src="https://lh3.googleusercontent.com/fife/APg5EOZGB0x6KiHp8lG2eeC0VWz4Sq7eUdo_eZKJUGW-cuq1SZgAcKRGHC-Ic24BlrG7HxYHgw8DCWl-df9OYaBj5HcQLXkj0ZjaBFT-RTGhQVCAmG44b1V7vdhm0dRmGCmvLT_RhmjNQBOrwakKGdA1GnlG3u6bd2IoajIpAdmdKu4CWxacH9to9-ZHOeaW_kpmYl-k85iIGSxBNSdkbO4kI8hcEp0tkEi84vNSRHGPq8bJ1YPXOZ2MDiVxnIxrNXMi6AQUSCtB6wl3pmZcJa_iIVQ4Bhq2QFn0PgemTotNk1I662g1gX-fYzv9rgegOAfnnK6J7AQ9z-goIvFcohEQ8LrG5bjoahr1CnpVSaNW1Oj7ycuzcBfrBJkVags5MWBH-2YCsQ0FbaazH0tBUDe8kjIsrwe814ZQ1bt3IurBMgHw3wD1mAMSawOJ7xz5V45-HRvbRopciMqjX-O8ge5In5jujIc7EbghGvnVAmxyeI7eKpD5iNbFno-HhsR2UF5E3_QC5036vcpjH9GncEwp66nIGndD0H6SRYz6bHt-1rKsqxTDY7CahSkkd1tPZw0a5lMO5TnFTH3K46QAQ3uP_zkaHxg8P1rwCMfezkUorL3Ux4otxO1ZijRs-ip3EC3FuX0tHUUMUAvuCBgmotRKHU-v_tOUUNCoQOmD7UO5DYtMsvRWTHnrcBmoFyr3he2tJFrXnf_UdFhnMhJaFHVZO5Pq9Qs4_9lPnEvnT5B_SbgAJX-nuLBT2o4Ncd_NQnkyK9Occ92TjF2WLHMCHsPk-OyTNGsGuAZ52iAxQvsHBWcRaF-Ne5i2C-k6QwPgk6EtRquPsAVTb07YB_q-ZDOPpm-jsL5WLhT3WhTsaOiIg4pg5CeqTYj192c2N-Er_s2BkrU4eFpPl2mAy-C5tMECu-XIprYilg932xdapJWPHTCsWDyUM2qn28I-q6ijl_A2-UKxlsZ_QE4Z4r-AzwgNfykkE_4NpEgL-gLlDUKanasQwtg8Y1pmvzpwCD5SmEXunSm_9lxZxpSVCgo18t-PlZ6HKdcs1a9Vudw2VGa7m4E6ViiQwRsZ2R_Xo2TQfHtfZ_dTCsgW3UhBHcDVW0ziz3eC-YXiiNecIUtYsHOjRlJJhX4kfpoWCaUDnaaIk8TsH2Xd68LJKrt5kPzyYXvZVIw87WySCm29Bq_ZaAyxNUQwTVvXsx9aAK05V7w9YvbMwfyD_8WXd8cwCTf3UCjO9bX3KWIuYKcnDLPGkFQNb_wX-tcgbh9VWYTvJe0onN_mZ845Jcj0onPzgBHmVf41jlYSlo1-R4tJrHg58Ixe9DqdwL1IF2Vg4z6GrNzy20Eg2zv-o7mi5AMVMiE62B0t4c44hGbzIKYBozgdWp8h5r-arQg9Ae8muGwhG42SIeuEEZYjmW9E1A9Jw65j2DJwhIdUcOydP7ANAd3VbSi1JNAitIPKZ1gD-rlW9c1c9ZrGTzX-r1PrIOzodODzP7QDCXqjfmvyqaTQves-Ls0Al49QGAaMwJW-Gv_4f2rZvEB0_STxRLRt-AozIB5Urmxghh23uhD2JOCOnLu7tI-L_7Eq036l2gg=w2880-h1642">

# Wagmi Connectors
### This repo creates Wagmi connectors for common providers that haven't been added yet yo Wagmi's connector repo. 
### ⚠️⚠️ WARNING ⚠️⚠️ Subject to change. Likely to be deprecated/abandoned when official Wagmi connectors of the same name are released.

# Example
```ts
import { IFrameEthereumConnector, LedgerHIDConnector } from '@past3lle/wagmi-connectors'
import { addConnector } from '@past3lle/web3-modal'

export const wagmiConnectors = {
  ledgerLiveModal: addConnector(LedgerConnector, {
    enableDebugLogs: false,
    walletConnectVersion: 2,
    projectId: WALLETCONNECT_ID,
    requiredChains: [1]
  }),
  ledgerHID: addConnector(LedgerHIDConnector, {}),
  ledgerIFrame: addConnector(IFrameEthereumConnector, {})
}
```