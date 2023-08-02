/*
 * MIT License
 *
 * Copyright (c) 2020 Ashutosh Varma
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
 * THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
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
      console.log(`Received ${res.statusCode}`)
      if (res.statusCode >= 400) {
        reject(Error(`Received ${res.statusCode} from ${url}`))
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
