const { Worker, isMainThread, parentPort } = require('worker_threads')
const { readFile, writeFile, copyFile } = require('fs').promises
const postcss = require('postcss')
const Terser = require('terser')

const plugins = [
  require('postcss-easy-import'),
  require('postcss-mixins'),
  require('postcss-custom-selectors'),
  require('postcss-nested'),
  require('autoprefixer'),
  require('postcss-custom-media'),
  require('postcss-discard-comments'),
  require('postcss-each'),
  require('cssnano')({
    preset: 'default',
  })
]

const DIR = {
  src: `${__dirname}/src`,
  dest: `${__dirname}/mod_discord/media`,
}

async function processJs() {
  try {
    const src = `${DIR.src}/js/mod_discord.js`
    const file = await readFile(src, { encoding: 'utf8' })
    const minify = await Terser.minify(file, { format: { comments: false } } )
    copyFile(src, `${DIR.dest}/js/mod_discord.js`)
    writeFile(`${DIR.dest}/js/mod_discord.min.js`, minify.code, { flag: 'w' }, () => true)
  } catch(error) {
    console.log(error)
  }
}

async function processCss() {
  try {
    const file = await readFile(`${DIR.src}/css/mod_discord.css`, { encoding: 'utf8' })
    const dest = `${DIR.dest}/css/mod_discord.min.css`
    const compiled = await postcss(plugins).process(file, { from: file, to: dest })
    writeFile(dest, compiled.css, { flag: 'w' }, () => true)
  } catch(error) {
    console.log(error)
  }
}

if (isMainThread) {
  const worker = new Worker(__filename)
  worker.postMessage('message')
} else {
  parentPort.once('message', () => {
    processJs()
    processCss()
  })
}
