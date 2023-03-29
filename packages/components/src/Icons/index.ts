import { ArrowLeft, ArrowRight, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'react-feather'
import { X } from 'react-feather'
import styled from 'styled-components'

export const CloseIcon = styled(X)<{ onClick: () => void }>`
  cursor: pointer;
`

export { ArrowLeft, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CheckCircle }
