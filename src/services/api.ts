const HOST = location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://satoshi-ama.ngrok.app'
const RELEASE = import.meta.env.VITE_RELEASE || ''

const request = async (method: string, path: string, body?: object) => {
  const res = await fetch(`${HOST}${path}`, {
    method, headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Release': RELEASE,
    },
    body: body ? JSON.stringify(body) : null,
  })
  const data = await res.json()
  return data
}

export default {
  get: (path: string) => {
    return request('GET', path)
  },

  post: (path: string, body: object) => {
    return request('POST', path, body)
  }
}