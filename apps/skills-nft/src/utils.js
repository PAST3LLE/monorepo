export function reduceArgsToObject(acc, val, i, arr) {
  const isDoubleDash = val.slice(0, 2) === '--'
  const isSingleDash = val.slice(0, 1) === '-'

  if (isDoubleDash) {
    const key = val.slice(2)
    acc[key] = arr[i + 1]
  } else if (isSingleDash) {
    const key = val.slice(1)
    acc[key] = arr[i + 1]
  }

  return acc
}

export function extractArgs(argsList) {
  if (!argsList || !argsList.length) throw new Error('No node args detected, check script')
  return argsList
    .slice(2)
    .reduce((acc, items) => [...acc, ...items.split('=')], [])
    .reduce(reduceArgsToObject, {})
}
