// Rebuilds assets/tgui.js and assets/tgui.css (minified) on Node 20 without gulp.
// Same pipeline as gulp/js.js and gulp/css.js. Run: npm run build (in tgui/).
const fs = require('fs'), path = require('path')
const src = 'src', dest = 'assets'
process.chdir(__dirname)

async function js () {
  const b = require('browserify')
  const componentify = require('ractive-componentify')
  const babel = require('babel-core')
  const stylus = require('stylus')
  componentify.compilers['text/javascript'] = (source) => {
    const cfg = Object.assign({ sourceMaps: true }, JSON.parse(fs.readFileSync(`${src}/.babelrc`, 'utf8')))
    const c = babel.transform(source, cfg)
    return { source: c.code, map: c.map }
  }
  componentify.compilers['text/stylus'] = (source, file) => ({ source: stylus.render(source, { filename: file }) })
  const bundle = b(`${src}/tgui.js`, { cache: {}, packageCache: {}, extensions: ['.js', '.ract'], paths: [src] })
  bundle.plugin(require('bundle-collapser/plugin'))
  bundle.transform(require('babelify'))
    .plugin(require('babelify-external-helpers'))
    .transform(componentify)
    .transform(require('require-globify'))
    .transform(require('es3ify'))
  const code = await new Promise((res, rej) => bundle.bundle((e, buf) => e ? rej(e) : res(buf.toString())))
  const min = require('uglify-js').minify(code, { fromString: true, mangle: true, compress: { unsafe: true } }).code
  fs.writeFileSync(`${dest}/tgui.js`, min)
  console.log('tgui.js', min.length)
}

async function css () {
  const stylus = require('stylus'), postcss = require('postcss')
  const file = `${src}/tgui.styl`
  const out = stylus(fs.readFileSync(file, 'utf8')).set('filename', file).set('paths', [src])
    .define('data-url', stylus.url({ name: 'data-url', paths: [src] })).render()
  const r = await postcss([
    require('autoprefixer')({ browsers: ['last 2 versions', 'ie >= 8'] }),
    require('postcss-filter-gradient'),
    require('postcss-opacity'),
    require('postcss-color-rgba-fallback')({ oldie: true }),
    require('pleeease-filters')({ oldIE: true }),
    require('postcss-font-weights')
  ]).process(out, { from: file })
  const m = await postcss([require('cssnano')({ autoprefixer: false })]).process(r.css, { from: file })
  fs.writeFileSync(`${dest}/tgui.css`, m.css)
  console.log('tgui.css', m.css.length)
}

js().then(css).catch(e => { console.error(e); process.exit(1) })
