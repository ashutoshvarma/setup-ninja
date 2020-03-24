/*
 * MIT License
 *
 * Copyright (c) 2020 ${company}
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
import fs from 'fs'
import YAML from 'yaml'
import {exec} from 'child_process'

const ACTION_FILE = fs.readFileSync('action.yml', 'utf8')

const parseObj = YAML.parse(ACTION_FILE)
const inputs = parseObj.inputs

let envString = ''

for (const key of Object.keys(inputs)) {
  if (inputs[key].default) {
    envString = `${envString} INPUT_${key.replace(/ /g, '_').toUpperCase()}='${
      inputs[key].default
    }'`
  }
}

exec(`env ${envString} node lib/main.js`, (err, stdout, stderr) => {
  if (err) {
    console.log(err.message)
  }
  // the *entire* stdout and stderr (buffered)
  console.log(`stdout:-\n ${stdout}`)
  console.log(`stderr:-\n ${stderr}`)
})
