import { createGlobalStyle } from 'styled-components'

import Roboto100 from '../../assets/fonts/Roboto/Roboto100.ttf'
import Roboto100Italic from '../../assets/fonts/Roboto/Roboto100Italic.ttf'
import Roboto300 from '../../assets/fonts/Roboto/Roboto-Light.ttf'
import Roboto300Italic from '../../assets/fonts/Roboto/Roboto-LightItalic.ttf'
import Roboto400 from '../../assets/fonts/Roboto/Roboto-Regular.ttf'
import Roboto400Italic from '../../assets/fonts/Roboto/Roboto-Italic.ttf'
import Roboto500 from '../../assets/fonts/Roboto/Roboto-Medium.ttf'
import Roboto500Italic from '../../assets/fonts/Roboto/Roboto-MediumItalic.ttf'
import Roboto700 from '../../assets/fonts/Roboto/Roboto-Bold.ttf'
import Roboto700Italic from '../../assets/fonts/Roboto/Roboto-BoldItalic.ttf'
import Roboto900 from '../../assets/fonts/Roboto/Roboto-Black.ttf'
import Roboto900Italic from '../../assets/fonts/Roboto/Roboto-BlackItalic.ttf'

const FontStyles = createGlobalStyle`
    @font-face {
        font-family: 'Roboto';
        src: url(${Roboto100}) format('truetype');
        font-style: normal;
        font-weight: 100;
    }
    @font-face {
        font-family: 'Roboto';
        src: url(${Roboto100Italic}) format('truetype');
        font-style: italic;
        font-weight: 100;
    }
    @font-face {
        font-family: 'Roboto';
        src: url(${Roboto300}) format('truetype');
        font-style: normal;
        font-weight: 300;
    }
    @font-face {
        font-family: 'Roboto';
        src: url(${Roboto300Italic}) format('truetype');
        font-style: italic;
        font-weight: 300;
    }
    @font-face {
        font-family: 'Roboto';
        src: url(${Roboto400}) format('truetype');
        font-style: normal;
        font-weight: 400;
    }
    @font-face {
        font-family: 'Roboto';
        src: url(${Roboto400Italic}) format('truetype');
        font-style: italic;
        font-weight: 400;
    }
    @font-face {
        font-family: 'Roboto';
        src: url(${Roboto500}) format('truetype');
        font-style: normal;
        font-weight: 500;
    }
    @font-face {
        font-family: 'Roboto';
        src: url(${Roboto500Italic}) format('truetype');
        font-style: italic;
        font-weight: 500;
    }
    @font-face {
        font-family: 'Roboto';
        src: url(${Roboto700}) format('truetype');
        font-style: normal;
        font-weight: 700;
    }
    @font-face {
        font-family: 'Roboto';
        src: url(${Roboto700Italic}) format('truetype');
        font-style: italic;
        font-weight: 700;
    }
    @font-face {
        font-family: 'Roboto';
        src: url(${Roboto900}) format('truetype');
        font-style: normal;
        font-weight: 900;
    }
    @font-face {
        font-family: 'Roboto';
        src: url(${Roboto900Italic}) format('truetype');
        font-style: italic;
        font-weight: 900;
    }
`

export default FontStyles
