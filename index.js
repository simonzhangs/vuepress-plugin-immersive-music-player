const { resolve } = require('path')

module.exports = (options, context) => ({
    define() {
        const {
            sliderStyle = 'Nyancat',
            playListID = 633015043,
        } = options

        return {
            SLIDER_STYLE: sliderStyle,
            PLAYLIST_ID: playListID,
        }
    },
    name: 'vuepress-plugin-immersive-music-player',
    enhanceAppFiles: resolve(__dirname,'./bin/enhanceAppFile.js'),
    globalUIComponents: 'szPlayer',
})