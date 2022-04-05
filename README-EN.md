# vuepress-plugin-immersive-music-player

[![downloads](https://img.shields.io/npm/dm/vue-slider-component.svg)](https://www.npmjs.com/package/vuepress-plugin-immersive-music-player)
[![npm-version](https://img.shields.io/npm/v/vue-slider-component.svg)](https://img.shields.io/npm/v/vue-slider-component.svg)

> 🎚 An immersive and personalized vuepress music plugin

[English] | [简体中文](https://github.com/simonzhangs/vuepress-plugin-immersive-music-player#readme)

## 🌟 Version 1.1.X

### New features
- Support custom configuration to play playlist
- Support for custom configuration playback progress bar theme


#### install

```bash
$ yarn add vuepress-plugin-immersive-music-player
# npm install vuepress-plugin-immersive-music-player --save
```

#### Caution
- The contents of the `./bin/sz-player/logos` folder need to be copied to the `./vuepress/public/img/logos` folder.

## ✨ Features
- 🍖 Personalized playback progress bar
- 👗 Global player component
- 🍒 Based on NetEase Cloud Interface
- 🔧 Easy to configure


## 🎯 Install
```bash
$ yarn add vuepress-plugin-immersive-music-player
# npm install vuepress-plugin-immersive-music-player --save
```


## 🚀 Vuepress configuration

### Add to .vuepress/config.js

```js
module.exports = {
  plugins: [
    //...
    ['vuepress-plugin-immersive-music-player']
    //...
  ]
};
```

### sliderStyle

It is used to configure the theme of the playback progress bar. There are currently three themes: `isSpitRainbow`, `isRainbow`, `isNyancat`; the renderings are as follows:

- `isSpitRainbow`:
![`isSpitRainbow`](https://cdn.jsdelivr.net/gh/simonzhangs/image-hosting@master/vue-plugin-example/spitRainbow-example.7iblvhk8l5o0.webp)

- `isRainbow`:
![`isRainbow`](https://cdn.jsdelivr.net/gh/simonzhangs/image-hosting@master/vue-plugin-example/rainbow-exapmle.60mrbyhx2cc0.webp)

- `isNyancat`:
![`isNyancat`](https://cdn.jsdelivr.net/gh/simonzhangs/image-hosting@master/vue-plugin-example/nyancat-example.3zqlf6pdhny0.webp)

### playListID

It is used to configure the player to play the playlist, just enter the playlist ID you want to listen to in NetEase Cloud; the playlist ID can refer to [HowlerMusic website - online player based on NetEase cloud interface](http://woaitouxiang.top)

## 📚  Documentation

Document：TODO

Live Demo：[demo](https://simonzhangs.github.io/)

Plug-in configuration effect： [online address](https://simonzhangs.github.io/)

## Changelog

Each version[CHANGELOG](https://github.com/simonzhangs/vuepress-plugin-immersive-music-player/blob/main/CHANGELOG.md)。


## License

[MIT]