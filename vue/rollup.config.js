import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
const isDev = process.env.ENV === 'development'

export default {
  input: './src/index.js',
  output: {
    file: 'dist/umd/vue.js',
    name: 'Vue',
    format: 'umd',
    sourcemap: isDev
  },
  plugin: [
    babel({ exclues: 'node_modules/**' }),
    serve({
      open: true,
      openPage: '/public/index.html',
      port: 3000,
      contentBase: '',
    })
  ]
}