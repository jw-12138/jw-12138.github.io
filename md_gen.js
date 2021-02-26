const { program } = require('commander')
const fs = require('fs')
const mk = require('marked')
const watch = require('node-watch')

program.version('0.0.1')
program.option('-i, --input <file>', 'input file').option('-w --watch', 'watch mod')
program.parse(process.argv)

const options = program.opts()

let build_file = function(path) {
  let relative_path = path.split('/')
  let input_filename = relative_path[relative_path.length - 1]
  relative_path.pop()
  relative_path = relative_path.join('/') + '/'

  let input_file_prefix = input_filename.split('.')
  input_file_prefix = input_file_prefix[0]
  let output_file_name = relative_path + input_file_prefix + '.html'

  let md = getContent(path)
  let html = mk(md)

  fs.writeFile(output_file_name, html, {}, function() {
    let d = new Date()
    console.log(d + ' : markdown file compiled successfully!')
  })
}

let getContent = function(path) {
  return fs.readFileSync(path, 'utf8')
}

if (options.input) {
  build_file(options.input)
}

if (options.watch) {
  watch(options.input, { recursive: false }, function(evt, name) {
    build_file(options.input)
  })
}
