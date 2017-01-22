/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Mark van Seventer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Strict mode.
'use strict'

// Standard lib.
const path = require('path')

// Package modules.
const pipe = require('multipipe')
const sharp = require('sharp')

// Local modules.
const queue = require('./queue')

// Exports.
module.exports = {
  // Convert a list of files.
  files: (input, output) => {
    const promises = input.map((src) => {
      const dest = path.join(output, path.basename(src))
      return queue.drain(sharp(src)).toFile(dest)
    })
    return Promise.all(promises)
  },

  // Convert a stream.
  stream: (inStream, outStream) => {
    return new Promise((resolve, reject) => {
      const stream = pipe(inStream, queue.drain(sharp()), outStream)
      stream.once('error', reject)
      stream.on('finish', resolve)
    })
  }
}