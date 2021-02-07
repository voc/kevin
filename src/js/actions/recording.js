export const SET_RECORD = 'SET_RECORD'
export const STARTED_RECORDING = 'STARTED_RECORDING'
export const STOPPED_RECORDING = 'STOPPED_RECORDING'

export const setRecord = record => ({ type: SET_RECORD, record })
export const startRecording = () => ({ type: STARTED_RECORDING })
export const stopRecording = () => ({ type: STOPPED_RECORDING })
