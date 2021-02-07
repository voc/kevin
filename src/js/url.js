// serialize flat url params
export function serialize (obj) {
  const str = []
  for (var p in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, p) && obj[p] !== undefined) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }
  return str.join('&')
}

// convert url params to object
export function deserialize (string) {
  const result = {}
  if (string) {
    const parts = string.split(/&|\?/)
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].split('=')
      if (part.length === 2) { result[decodeURIComponent(part[0])] = decodeURIComponent(part[1]) }
    }
  }
  return result
}
