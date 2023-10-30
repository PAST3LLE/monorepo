export function trimAndLowerCase(thing: string | undefined) {
  if (!thing) return ''

  return thing.replace(' ', '').toLowerCase()
}
