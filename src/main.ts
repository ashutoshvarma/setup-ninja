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
import * as core from '@actions/core'
import * as io from '@actions/io'
import * as util from './util'
import fs from 'fs'
import JSZip, {JSZipObject} from 'jszip'
import path from 'path'

async function run(): Promise<void> {
  try {
    const ninjaVersion: string = core.getInput('version', {required: false})
    const ninjaDest: string = core.getInput('dest')
    const ninjaPlatform: string = util.getPlatform(core.getInput('platform'))
    if (!ninjaPlatform) throw Error('Unsupported Platform')

    const ninjaDwdUrl = `https://github.com/ninja-build/ninja/releases/download/v${ninjaVersion}/ninja-${ninjaPlatform}.zip`

    let ninjaBinaryName = 'ninja'
    if (util.IS_WIN) {
      ninjaBinaryName = `${ninjaBinaryName}.exe`
    }

    // create folders
    await io.mkdirP(ninjaDest)

    const ninjaFilepath = path.join(ninjaDest, ninjaBinaryName)

    const buff = await util.downloadAsBuffer(ninjaDwdUrl)

    const ninjaZip: JSZip = await JSZip.loadAsync(buff)
    const ninjaBinary: JSZipObject = ninjaZip.files[ninjaBinaryName]
    if (ninjaBinary) {
      await ninjaBinary.async('nodebuffer').then(content => {
        fs.writeFileSync(ninjaFilepath, content)
      })
    } else {
      throw Error(`Could not found "${ninjaBinaryName}" in the downloaded file`)
    }

    // make binary executable
    fs.chmodSync(ninjaFilepath, '755')
    core.info(`Successfully installed ninja-${ninjaVersion} at ${ninjaDest}`)

    // add to path
    core.addPath(ninjaDest)

    core.info(`Successfully added ninja-${ninjaVersion} to PATH`)
  } catch (error) {
    core.setFailed(error.message)
  }
}
run()
