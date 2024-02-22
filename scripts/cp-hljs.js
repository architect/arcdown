import fse from 'fs-extra'

const vendorPath = 'src/vendor/highlight.js'

console.log('Copying highlight.js to src/vendor')

fse.emptyDirSync(vendorPath)

fse.copySync(
  'node_modules/highlight.js/lib',
  `${vendorPath}`,
  {
    overwrite: true,
    filter: (src) => {
      // don't copy languages/** or .ts files
      return !src.startsWith('node_modules/highlight.js/lib/languages')
        && !src.endsWith('.ts')
    }
  }
)

fse.copySync(
  'node_modules/highlight.js/es/languages',
  `${vendorPath}/languages`,
  {
    overwrite: true,
    filter: (src) =>
      // don't copy the deprecation .js.js files or .ts files
      !src.endsWith('.js.js'),
  }
)

for (const file of fse.readdirSync(vendorPath)) {
  if (typeof file === 'string' && file.endsWith('.js')) {
    fse.renameSync(
      `${vendorPath}/${file}`,
      `${vendorPath}/${file.replace('.js', '.cjs')}`
    )
  }
}
