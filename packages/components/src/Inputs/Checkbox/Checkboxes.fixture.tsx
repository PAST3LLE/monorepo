import React from 'react'

import { useCheckboxes } from '.'
import { Row } from '../../Layout'

function Component() {
  const { Component } = useCheckboxes({
    name: 'CHECKBOXES FIXTURE',
    options: [
      { label: 'CHOICE 1', value: 1 },
      { label: 'CHOICE 2', value: 2 },
      { label: 'CHOICE 3', value: 3 }
    ],
    defaultValue: 1,
    callback: console.debug
  })
  return (
    <Row width={500} gap="5px">
      <Component boxSize="2.8rem" backgroundColor="navajowhite" checkedColor="indianred" borderColor="ghostwhite" />
    </Row>
  )
}

export default {
  default: <Component />
}
