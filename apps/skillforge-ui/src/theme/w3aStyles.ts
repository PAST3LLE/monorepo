import { createGlobalStyle } from 'styled-components/macro'

// Web3Auth styles
// changing rem units here mostly - would have been easier had they used em instead...
// rem = relative to body tag, hence the changes here
export const W3aStyles = createGlobalStyle`
    .w3a-parent-container #w3a-modal {
        .text-xs {
            font-size: 1.2rem;
            line-height: 1.6rem;
        }

        .w3a-header__logo img {
            width: 5rem;
        }

        .w3a-header__title {
            font-size: 2rem;
            line-height: 3.4rem;
        }

        div.w3a-header__subtitle {
            font-size: 1.4rem;
        }


        button.w3a-button {
            font-size: 1.6rem;
            line-height: 2.4rem;
            padding: 1.2rem 2.4rem;

            &-expand {
                font-size: 1.4rem;
                line-height: 2.2rem;
            }
        }
        .w3a-text-field {
            font-size: 1.4rem;
            line-height: 2rem;
            margin-top: 0rem;
            margin-bottom: 1.6rem;
            padding: 1.2rem 2.4rem;
        }

        div.w3a-social__policy {
            font-size: 1.2rem;
        }

        div.w3a-group__title {
            font-size: 1.4rem;
            line-height: 2.5rem;
            margin-bottom: 0.8rem;
        }

        .w3a-button--login {
            height: 4.4rem;
        }

        .w3a-wallet-connect__container {
            font-size: 1rem;
        }

        .w3a-wallet-connect {
            margin-bottom: 1.6rem;
        }
        
        .w3a-adapter-item  > button.w3a-button--login {
            padding: 0.5rem 1.2rem;
        }
    }
`
