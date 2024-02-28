export interface InputProps<V extends number | string | undefined> {
  defaultValue: V
  options: { value: V; label: string }[]
  name: string
  callback?: (value: V) => void
}
