class GridfoxHttp {
  private projectId: string | null = null

  private url = 'https://api.gridfox.com'

  private apiKey: string = import.meta.env.VITE_GRIDFOX_API_KEY as string;

  private parentURL = new URL(document.referrer || this.url)

  init(): Promise<void> {
    return new Promise(resolve => {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'complete') {
          resolve()
        }
      })
    })
  }
  async getUser(): Promise<Record<string, any> | null> {
    const token = await this.requestToken()
    try {
      const parsedToken = JSON.parse(atob(token.split('.')[1]))
      return {
        email: parsedToken.email,
        userId: parsedToken.sub
      }
    } catch (e) {
      return null
    }
  }
  async requestProjectId(): Promise<void> {
    await this.init()
    if (this.projectId) {
      // If project id is already set, return existing project id
      return Promise.resolve()
    }
    window.parent.postMessage('request-gridfox-project-id', this.parentURL.origin)
    return new Promise(resolve => {
      this.gridfoxAppMessages(event => {
        this.projectId = event.data.data.projectId
        resolve()
      }, 'gridfox-project-id')
    })
  }
  private requestToken(): Promise<string> {
    window.parent.postMessage('request-gridfox-custom-auth', this.parentURL.origin)
    return new Promise(resolve => {
      this.gridfoxAppMessages(event => {
        resolve(event.data.data.accessToken as string)
      }, 'gridfox-custom-auth')
    })
  }
  private gridfoxAppMessages(
    callback: (event: MessageEvent) => void,
    ignoreEventType: string | null = null
  ) {
    window.addEventListener('message', event => {
      const invalidOrigin = event.origin !== this.parentURL.origin
      const invalidEventType = ignoreEventType
        ? event.data.type !== ignoreEventType
        : false
      if (!invalidOrigin && !invalidEventType) {
        callback(event)
      }
    })
  }
  private async getHeaders(isFormData = false): Promise<Headers> {
    let token: string
    if (!this.apiKey) {
      token = await this.requestToken()
    }
    const headers = new Headers()
    if (!isFormData) {
      headers.append('Content-Type', 'application/json')
    }
    if (token) {
      headers.append('Authorization', `Bearer ${token}`)
      headers.append('gridfox-project-id', this.projectId)
    } else if (this.apiKey) {
      headers.append('gridfox-api-key', this.apiKey)
    }
    return headers
  }
  public async get(endpoint: string): Promise<any> {
    const headers = await this.getHeaders()
    if (!headers) return Promise.reject()
    return new Promise((resolve, reject) => {
      fetch(this.url + endpoint, {
        method: 'GET',
        headers: headers
      }).then(res => this.parseJsonResponse(res, resolve, reject))
    })
  }
  public async post(
    endpoint: string,
    payload: Record<string, any> | FormData
  ): Promise<any> {
    const isFormData = payload instanceof FormData
    const headers = await this.getHeaders(isFormData)
    return new Promise((resolve, reject) => {
      fetch(this.url + endpoint, {
        method: 'POST',
        headers: headers,
        body: isFormData ? payload : JSON.stringify(payload)
      }).then(res => this.parseJsonResponse(res, resolve, reject))
    })
  }
  public async put(
    endpoint: string,
    payload: Record<string, any> | FormData
  ): Promise<any> {
    const isFormData = payload instanceof FormData
    const headers = await this.getHeaders(isFormData)
    return new Promise((resolve, reject) => {
      fetch(this.url + endpoint, {
        method: 'PUT',
        headers: headers,
        body: isFormData ? payload : JSON.stringify(payload)
      }).then(res => this.parseJsonResponse(res, resolve, reject))
    })
  }
  public async delete(endpoint: string): Promise<any> {
    const headers = await this.getHeaders()
    return new Promise((resolve, reject) => {
      fetch(this.url + endpoint, {
        method: 'DELETE',
        headers: headers
      }).then(res => this.parseJsonResponse(res, resolve, reject))
    })
  }
  public async getBlob(endpoint: string): Promise<Blob> {
    const headers = await this.getHeaders()
    return new Promise((resolve, reject) => {
      fetch(this.url + endpoint, {
        method: 'GET',
        headers: headers
      })
        .then(res => res.blob())
        .then(blob => {
          resolve(blob)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  public parseJsonResponse(
    res: Response,
    resolve: (value: unknown) => void,
    reject: (value: unknown) => void
  ) {
    res
      .text()
      .then(text => {
        if (text) {
          try {
            const data = JSON.parse(text)
            resolve(data)
          } catch (text) {
            resolve(text)
          }
        } else {
          resolve(text)
        }
      })
      .catch(err => {
        reject(err)
      })
  }
}
const gridfoxHttp = new GridfoxHttp()
export default gridfoxHttp
