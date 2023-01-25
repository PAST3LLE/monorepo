import * as React from 'react'
import { PNG } from '@past3lle/assets'
import { ColumnCenter, Modal, Button, BV, Pastellecon, Text as LayoutText } from '@past3lle/components'
import { useOnClickOutside }from '@past3lle/hooks'
import { PstlMain, PstlHeader, PstlNav, PstlFooter } from '../components/Layout'
import { useTheme } from 'styled-components'
import { ThemeModes } from '@past3lle/theme'

const App = () => {
  const ref = React.useRef()
  const [modalOpen, setModalOpen] = React.useState(false)
  useOnClickOutside(ref, () => setModalOpen(false))

  const { mode, setMode } = useTheme()

  return (
    <>
      <Modal isOpen={modalOpen} onDismiss={console.debug}>
        <ColumnCenter style={{ backgroundColor: 'lightseagreen', width: '100%' }} ref={ref}>
          <LayoutText.SubHeader>MODAL OPEN</LayoutText.SubHeader>
          <LayoutText.Black>Click anywhere outside modal to close</LayoutText.Black>
        </ColumnCenter>
      </Modal>
      <PstlHeader>
        <Pastellecon />
      </PstlHeader>
      <PstlNav />
      <PstlMain>
        <LayoutText.LargeHeader>EXAMPLE APP</LayoutText.LargeHeader>
        <LayoutText.SubHeader>Click button for modal!</LayoutText.SubHeader>
        <Button variant={BV.PRIMARY} onClick={() => setModalOpen(true)}>
          See modal
        </Button>
        <LayoutText.SubHeader>CURRENT THEME: {mode}</LayoutText.SubHeader>
        <Button  variant={BV.THEME} onClick={() => setMode(mode === ThemeModes.DARK ? ThemeModes.LIGHT : ThemeModes.DARK)} bgImage={PNG.LogoCircle_2x} color={"#000"}>CHANGE THEME</Button>
      </PstlMain>
      <PstlFooter>
        <ul>
          <LayoutText.SubHeader>Column 1</LayoutText.SubHeader>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
        </ul>

        <ul>
          <LayoutText.SubHeader>Column 2</LayoutText.SubHeader>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
        </ul>

        <ul>
          <LayoutText.SubHeader>Column 3</LayoutText.SubHeader>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
        </ul>
      </PstlFooter>
    </>
  )
}

export { App }
