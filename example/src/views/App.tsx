import * as React from 'react'
import { ColumnCenter, LayoutText, Modal, Button, BV, useOnClickOutside } from '@past3lle/schematics'
import { PstlMain, PstlHeader, PstlNav, PstlFooter } from '../components/Layout'

const App = () => {
  const ref = React.useRef()
  const [modalOpen, setModalOpen] = React.useState(false)
  useOnClickOutside(ref, () => setModalOpen(false))

  return (
    <>
      <Modal isOpen={modalOpen} onDismiss={console.debug}>
        <ColumnCenter style={{ backgroundColor: 'lightseagreen', width: '100%' }} ref={ref}>
          <LayoutText.subHeader>MODAL OPEN</LayoutText.subHeader>
          <LayoutText.black>Click anywhere outside modal to close</LayoutText.black>
        </ColumnCenter>
      </Modal>
      <PstlHeader />
      <PstlNav />
      <PstlMain>
        <LayoutText.largeHeader>EXAMPLE APP</LayoutText.largeHeader>
        <LayoutText.subHeader>Click button for modal!</LayoutText.subHeader>
        <Button variant={BV.PRIMARY} onClick={() => setModalOpen(true)}>
          See modal
        </Button>
      </PstlMain>
      <PstlFooter>
        <ul>
          <LayoutText.subHeader>Column 1</LayoutText.subHeader>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
        </ul>

        <ul>
          <LayoutText.subHeader>Column 2</LayoutText.subHeader>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
        </ul>

        <ul>
          <LayoutText.subHeader>Column 3</LayoutText.subHeader>
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
