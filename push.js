require('dotenv').config()
const {exec} = require('child_process')

if (!process.env.GITHUB_TOKEN) {
  throw new Error('GITHUB_TOKEN is not set')
}

let t = process.env.GITHUB_TOKEN
let repo = 'jw-12138/jw-12138.github.io.git'

async function configGit() {
  let {
    err,
    stdout,
    stderr
  } = await exec(`git config --global user.name 'build@vercel'; git config --global user.email '29943110+jw-12138@users.noreply.github.com'`)
  if (err) {
    console.log(err)
  }
  if (stderr) {
    console.log(stderr)
  }

  console.log(stdout)
}

async function push() {
  let {
    err,
    stdout,
    stderr
  } = exec(`git add README.md; git commit -m 'update README.md'; git push https://${t}@github.com/${repo} main`)
  if (err) {
    console.error(err)
  }

  if (stderr) {
    console.log(stderr)
  }

  console.log(stdout)
}

configGit().then(push)

