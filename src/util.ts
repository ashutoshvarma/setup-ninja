/* eslint-disable no-console */
import request from 'request'

export const IS_WIN: boolean = process.platform === 'win32'
export const IS_LINUX: boolean = process.platform === 'linux'
export const IS_MAC: boolean = process.platform === 'darwin'

export async function downloadAsBuffer(url: string): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    console.log(`Downloading file ${url}`)
    request.get({url, encoding: null}, (err, res, body) => {
      if (err) {
        reject(err)
      }
      console.log(`Recieved ${res.statusCode}`)
      if (res.statusCode >= 400) {
        reject(Error(`Recieved ${res.statusCode} from ${url}`))
      } else {
        console.log(`Download Complete.`)
        resolve(body)
      }
    })
  })
}

export function getPlatform(platform: string): string {
  if (!platform) {
    return IS_MAC ? 'mac' : IS_LINUX ? 'linux' : IS_WIN ? 'win' : ''
  } else {
    return ['mac', 'linux', 'win'].includes(platform) ? platform : ''
  }
}
