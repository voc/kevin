import { deserialize } from 'js/url'

export const PARSED_PARAMS = 'PARSED_PARAMS'
export const parseParams = () => {
  const params = deserialize(location.search)
  return { type: PARSED_PARAMS, params }
}
