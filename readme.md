# vuepress-plugin-immersive-music-player

[![downloads](https://img.shields.io/npm/dm/vue-slider-component.svg)](https://www.npmjs.com/package/vuepress-plugin-immersive-music-player)
[![npm-version](https://img.shields.io/npm/v/vue-slider-component.svg)](https://img.shields.io/npm/v/vue-slider-component.svg)

> ð ä¸ä¸ªæ²æµ¸å¼ä¸ªæ§åçvuepress é³ä¹æä»¶

[English](https://github.com/simonzhangs/vuepress-plugin-immersive-music-player/blob/main/README-EN.md) | ç®ä½ä¸­æ

æ´æ°æ¥å¿[CHANGELOG](https://github.com/simonzhangs/vuepress-plugin-immersive-music-player/blob/main/CHANGELOG.md)ã

## ð Version 1.1.X

### æ°ç¹æ§
- æ¯æèªå®ä¹éç½®æ­æ¾æ­å
- æ¯æèªå®ä¹éç½®æ­æ¾è¿åº¦æ¡ä¸»é¢
- ð new! æ¯æç¨æ·çé¢ç´æ¥è¾å¥æ­åIDæ¿æ¢æ­æ¾æ­åï¼åå®¢è®¿é®èå¯ä»¥å¨æµè§åå®¢æ¶è¾å¥éæ©æ­æ¾çæ­å

#### å®è£

```bash
$ yarn add vuepress-plugin-immersive-music-player
# npm install vuepress-plugin-immersive-music-player --save
```

#### æ³¨æäºé¡¹
- `npm run build` æå»ºçæäºdistæä»¶å¤¹ï¼æä»¶ä¾¿çæäºï¼é¨ç½²å°èªå·±æå¡å¨å³å¯ã

## â¨ ç¹æ§
- ð ä¸ªæ§åæ­æ¾è¿åº¦æ¡
- ð å¨å±æ­æ¾å¨
- ð åºäºç½æäºæ¥å£
- ð§ éç½®ç®åæä¸æ


## ð¯ å®è£
```bash
$ yarn add vuepress-plugin-immersive-music-player
# npm install vuepress-plugin-immersive-music-player --save
```


## ð Vuepresséç½®

### Add to .vuepress/config.js

```js
module.exports = {
  plugins: [
    //...
    ['vuepress-plugin-immersive-music-player',{
      sliderStyle:{theme: 'isSpitRainbow'},
      playListID: 633015043,
    }]
    //...
  ]
};
```
### sliderStyle

ç¨äºéç½®æ­æ¾è¿åº¦æ¡ä¸»é¢ï¼ç®åå±åä¸ªä¸»é¢ï¼`isSpitRainbow`,`isRainbow`,`isNyancat`,`isMario`;ææå¾å¦ä¸ï¼

- `isSpitRainbow`:
![`isSpitRainbow`](https://cdn.jsdelivr.net/gh/simonzhangs/image-hosting@master/vue-plugin-example/spitRainbow-example.7iblvhk8l5o0.webp)

- `isRainbow`:
![`isRainbow`](https://cdn.jsdelivr.net/gh/simonzhangs/image-hosting@master/vue-plugin-example/rainbow-exapmle.60mrbyhx2cc0.webp)

- `isNyancat`:
![`isNyancat`](https://cdn.jsdelivr.net/gh/simonzhangs/image-hosting@master/vue-plugin-example/nyancat-example.3zqlf6pdhny0.webp)

- `isMario`:
![mario-example](https://cdn.jsdelivr.net/gh/simonzhangs/image-hosting@master/vue-plugin-example/mario-example.3bmtxznwesc0.webp)

### playListID

ç¨äºéç½®æ­æ¾å¨æ­æ¾æ­åï¼è¾å¥ç½æäºä¸­ä½ æ³å¬çæ­åIDå³å¯ï¼æ­åIDå¯ä»¥åè[HowlerMusicç½ç«-åºäºç½æäºæ¥å£å¨çº¿æ­æ¾å¨](http://woaitouxiang.top)

## ð ææ¡£

å¨çº¿ææ¡£ï¼TODO

å¨çº¿ä¾å­ï¼[demo](https://simonzhangs.github.io/)

æä»¶éç½®ææï¼ [å¨çº¿å°å](https://simonzhangs.github.io/)

## æ´æ°æ¥å¿

æ¯ä¸ªçæ¬ç[CHANGELOG](https://github.com/simonzhangs/vuepress-plugin-immersive-music-player/blob/main/CHANGELOG.md)ã


## License

[MIT]