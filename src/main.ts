/* eslint-disable no-console */
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
    io.mkdirP(ninjaDest)

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

    // add to path
    core.addPath(ninjaDest)

    console.log(`Successfully added ninja-${ninjaVersion} to PATH`)
  } catch (error) {
    core.setFailed(error.message)
  }
}
run()
