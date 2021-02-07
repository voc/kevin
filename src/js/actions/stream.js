export const ADDED_STREAM = 'ADDED_STREAM'
export const REMOVED_STREAM = 'REMOVED_STREAM'

export const addStream = stream => ({ type: ADDED_STREAM, stream })
export const removeStream = userid => ({ type: REMOVED_STREAM, userid })
