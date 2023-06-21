import styled from 'styled-components'

export const StyledCanvas = styled.canvas`
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
`

export const CanvasContainer = styled.div`
  height: 100%;
  width: 100%;
  img {
    position: absolute;
    bottom: 5%;
    z-index: 0;
    opacity: 0.5;
  }
`
