import { build, context } from 'esbuild'

const isWatch = process.argv.includes('--watch')

const options = {
  entryPoints: ['src/code.ts'],
  bundle: true,
  outfile: 'dist/code.js',
  target: ['es2017'],
  logLevel: 'info',
}

if (isWatch) {
  const ctx = await context(options)
  await ctx.watch()
  console.log('Watching for changes...')
} else {
  await build(options)
}
