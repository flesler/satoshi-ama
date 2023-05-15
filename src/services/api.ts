const HOST: string | undefined = import.meta.env.VITE_API_URL

const request = async (method: string, path: string, body?: object) => {
  if (!HOST) {
    throw new Error('No VITE_API_URL provided')
  }
  const res = await fetch(`${HOST}${path}`, {
    method, headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
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