const path = require('path')
const { exec } = require('child_process')

const App = function () {
  this.init = function () {
    let _ = app
    _.getMP3s()
  }

  this.getMP3s = function () {
    let _ = app
    let walk = require('walk')
    let files = []

    // Walker options
    let walker = walk.walk('./', { followLinks: false })

    walker.on('file', function (root, stat, next) {
      if (path.extname(stat.name) === '.mp3' || path.extname(stat.name) === '.MP3') {
        files.push(stat.name)
      }
      next()
    })

    walker.on('end', function () {
      _.genShell(files)
    })
  }

  this.genShell = function (mp3s) {
    let _ = app
    let shs = []

    for (let i = 0; i < mp3s.length; i++) {
      let mp3 = mp3s[i]
      let name = path.basename(mp3).split('.')[0]

      let pic_name = name + '.png'
      let sh = `ffmpeg -i ${mp3} -filter_complex showwavespic=colors=#979797:s=1800x60 -frames:v 1 ${pic_name} -y`

      shs.push(sh)
    }

    _.genPics(shs)
  }

  this.genPics = function (shs) {
    for (let i = 0; i < shs.length; i++) {
      let sh = shs[i]
      exec(sh, function (err, stdout, stderr) {
        if (err) {
          console.log(`node couldn't execute the command: \`${sh}\``)
          return
        }

        console.log(`Excuted: ${sh}`)
        console.log(`stderr: ${stderr}`)
      })
    }
  }
}

const app = new App()
app.init()
