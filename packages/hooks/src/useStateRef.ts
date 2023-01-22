import { SetStateAction, useCallback, useState } from 'react'

export function useStateRef<T>(
  defaultRef: T,
  processNode: (node: any) => SetStateAction<T>
): [T, (newNode: any) => void] {
  const [node, setNode] = useState<T>(defaultRef)

  const setRef = useCallback(
    (newNode: HTMLElement) => {
      setNode(processNode(newNode))
    },
    [processNode]
  )
  return [node, setRef]
}
