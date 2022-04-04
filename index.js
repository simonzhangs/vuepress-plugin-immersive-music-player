const { path } = require('@vuepress/shared-utils')

module.exports = (options, context) => ({
    define() {
        return {
            MUSICBAR_OPTIONS: options,
        }
    },
    name: 'vuepress-plugin-simonzhangs-musicplayer',
    enhanceAppFiles: [
        path.resolve(__dirname,'./bin/enhanceAppFile.js')
    ],
    globalUIComponents: 'szPlayer'
})