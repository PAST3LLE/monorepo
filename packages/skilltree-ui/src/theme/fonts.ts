import Gothic from '../assets/fonts/GothAndGothic.otf'
import { createGlobalStyle } from 'styled-components'

export const GothicFontCssProvider = createGlobalStyle`
    @font-face {
        font-family: 'Goth';
        src: url(${Gothic}) format('opentype');
        font-style: normal;
        font-weight: 100;
    }
    @font-face {
        font-family: 'Goth';
        src: url(${Gothic}) format('opentype');
        font-style: italic;
        font-weight: 100;
    }
    @font-face {
        font-family: 'Goth';
        src: url(${Gothic}) format('opentype');
        font-style: normal;
        font-weight: 300;
    }
    @font-face {
        font-family: 'Goth';
        src: url(${Gothic}) format('opentype');
        font-style: italic;
        font-weight: 300;
    }
    @font-face {
        font-family: 'Goth';
        src: url(${Gothic}) format('opentype');
        font-style: normal;
        font-weight: 400;
    }
    @font-face {
        font-family: 'Goth';
        src: url(${Gothic}) format('opentype');
        font-style: italic;
        font-weight: 400;
    }
    @font-face {
        font-family: 'Goth';
        src: url(${Gothic}) format('opentype');
        font-style: normal;
        font-weight: 500;
    }
    @font-face {
        font-family: 'Goth';
        src: url(${Gothic}) format('opentype');
        font-style: italic;
        font-weight: 500;
    }
    @font-face {
        font-family: 'Goth';
        src: url(${Gothic}) format('opentype');
        font-style: normal;
        font-weight: 700;
    }
    @font-face {
        font-family: 'Goth';
        src: url(${Gothic}) format('opentype');
        font-style: italic;
        font-weight: 700;
    }
    @font-face {
        font-family: 'Goth';
        src: url(${Gothic}) format('opentype');
        font-style: normal;
        font-weight: 900;
    }
    @font-face {
        font-family: 'Goth';
        src: url(${Gothic}) format('opentype');
        font-style: italic;
        font-weight: 900;
    }
`
