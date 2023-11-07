import {parseFile} from 'music-metadata'
import fs from 'fs'
import path from 'path'

console.log('Generating audio metadata...')

const walk = function (dir, done) {
  let results = []
  fs.readdir(dir, function (err, list) {
    if (err) return done(err)
    let i = 0
    ;(function next() {
      var file = list[i++]
      if (!file) return done(null, results)
      file = path.join(dir, file)
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res)
            next()
          })
        } else {
          results.push(file)
          next()
        }
      })
    })()
  })
}

walk('./source/p_assets/', function (err, res) {
  err && console.log(err)
  getAudioFiles(res)
})

let getAudioFiles = function (data) {
  let audioFiles = []
  data.forEach(el => {
    if (path.extname(el) === '.mp3') {
      audioFiles.push(el)
    }
  })
  writeAudioData(audioFiles)
}

let writeAudioData = function (data) {
  data.forEach(el => {
    (async () => {
      try {
        let metadata = await parseFile(el)
        let jsonPath = el.replace('.mp3', '.json')
        fs.writeFileSync(jsonPath, JSON.stringify(metadata))
        console.log(`Data written: ${jsonPath}`)
      } catch (error) {
        console.error(error.message)
      }
    })()
  })
}


