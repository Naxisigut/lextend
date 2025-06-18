const baseUrl = 'http://localhost:10086/Lextend'

function post(url: string, data: Record<string, any>) {
  return fetch(baseUrl + url, {
    method: 'POST',
    body: JSON.stringify(data)
  }).then((res) => {
    return res.json()
  })
}

const request = {
  post
}

export default request