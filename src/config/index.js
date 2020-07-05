const { REACT_APP_API_BASE } = process.env

export default {
  baseAPI: REACT_APP_API_BASE || 'http://localhost'
}
