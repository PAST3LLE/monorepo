import * as React from 'react'
import { ColumnCenter, Modal, Button, BV } from '@past3lle-schematics/components'
import { useOnClickOutside }from '@past3lle-schematics/hooks'
import { LayoutText } from '@past3lle-schematics/theme'
import { PstlMain, PstlHeader, PstlNav, PstlFooter } from '../components/Layout'

const App = () => {
  const ref = React.useRef()
  const [modalOpen, setModalOpen] = React.useState(false)
  useOnClickOutside(ref, () => setModalOpen(false))

  return (
    <>
      <Modal isOpen={modalOpen} onDismiss={console.debug}>
        <ColumnCenter style={{ backgroundColor: 'lightseagreen', width: '100%' }} ref={ref}>
          <LayoutText.SubHeader>MODAL OPEN</LayoutText.SubHeader>
          <LayoutText.Black>Click anywhere outside modal to close</LayoutText.Black>
        </ColumnCenter>
      </Modal>
      <PstlHeader />
      <PstlNav />
      <PstlMain>
        <LayoutText.LargeHeader>EXAMPLE APP</LayoutText.LargeHeader>
        <LayoutText.SubHeader>Click button for modal!</LayoutText.SubHeader>
        <Button variant={BV.PRIMARY} onClick={() => setModalOpen(true)}>
          See modal
        </Button>
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
