import { Howler, Howl } from "howler";
import { getTrackDetail, getMusicUrl, getPlaylistDetail } from "../api/music";

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, ms);
  });

function setTitle(track) {
  document.title = track
    ? `${track.name} · ${track.ar[0].name} - HowlerMusic`
    : "HowlerMusic";
}

export default class {
  constructor() {
    this._playing = false; // 是否正在播放中
    this._progress = 0; // 当前播放歌曲的进度
    this._enabled = false; // 是否启用Player
    this._volume = 1; // 0 to 1
    this._volumeBeforeMuted = 1; // 用于保存静音前的音量

    this._list = []; // 播放列表
    this._current = 0; // 当前播放歌曲在播放列表里的index
    this._playlistSource = { type: "album", id: 123 }; // 当前播放列表的信息
    this._currentTrack = { id: 86827685 }; // 当前播放歌曲的详细信息
    this._playNextList = []; // 当这个list不为空时，会优先播放这个list的歌

    // howler (https://github.com/goldfire/howler.js)
    this._howler = null;
    Object.defineProperty(this, "_howler", {
      enumerable: false,
    });

    // init
    this._init();

    window.howlermusic = {};
    window.howlermusic.player = this;
  }

  // 音量获取与设置
  get volume() {
    return this._volume;
  }
  set volume(volume) {
    this._volume = volume;
    Howler.volume(volume);
  }
  // 播放列表获取与设置
  get list() {
    return this._list;
  }
  set list(list) {
    this._list = list;
  }
  // 当前播放歌曲在播放列表里的index 获取与设置
  get current() {
    return this._current;
  }
  set current(current) {
    this._current = current;
  }
  // 是否启用player
  get enabled() {
    return this._enabled;
  }
  // 是否正在播放
  get playing() {
    return this._playing;
  }
  // 当前播放歌曲的详细信息
  get currentTrack() {
    return this._currentTrack;
  }
  // 当前播放列表的信息
  get playlistSource() {
    return this._playlistSource;
  }
  // 当这个list不为空时，会优先播放这个list的歌
  get playNextList() {
    return this._playNextList;
  }
  // 歌曲播放进度
  get progress() {
    return this._progress;
  }
  set progress(value) {
    if (this._howler) {
      this._howler.seek(value);
    }
  }
  // 当前歌曲长度
  get currentTrackDuration() {
    const trackDuration = this._currentTrack.dt || 1000;
    let duration = ~~(trackDuration / 1000);
    return duration > 1 ? duration - 1 : duration;
  }

  _init() {
    this._loadSelfFromLocalStorage();
    Howler.autoUnlock = false;
    Howler.usingWebAudio = true;
    Howler.volume(this.volume);

    if (this._enabled) {
      // 恢复当前播放歌曲
      this._replaceCurrentTrack(this._currentTrack.id, false).then(() => {
        // this._howler?.seek(window.localStorage.getItem("playerCurrentTrackTime") ?? 0);
      });
      // update audio source and init howler
      this._initMediaSession();
    }

    this._setIntervals();
  }

  _setPlaying(isPlaying) {
    this._playing = isPlaying;
  }

  _setIntervals() {
    setInterval(() => {
      if (this._howler === null) return;
      this._progress = this._howler.seek();
      // window.localStorage.setItem("playerCurrentTrackTime", this._progress);
    }, 1000);
  }

  //player 实例对象从缓存读取
  _loadSelfFromLocalStorage() {
    // const player = JSON.parse(window.localStorage.getItem("player"));
    if (!player) return;
    for (const [key, value] of Object.entries(player)) {
      this[key] = value;
    }
  }

  // 更换当前播放单曲
  _replaceCurrentTrack(
    id,
    autoplay = true,
    ifUnplayableThen = "playNextTrack"
  ) {
    // 听歌记录同步到网易云
    // if (autoplay && this._currentTrack.name) {
    //   this._scrobble(this.currentTrack, this._howler?.seek());
    // }
    return getTrackDetail(id).then((data) => {
      let track = data.songs[0];
      this._currentTrack = track;
      this._updateMediaSessionMetaData(track);
      return this._getAudioSource(track).then((source) => {
        if (source) {
          this._playAudioSource(source, autoplay);
          this._cacheNextTrack();
          return source;
        } else {
          console.log(`无法播放 ${track.name}`);
          if (ifUnplayableThen === "playNextTrack") {
            this.playNextTrack();
          } else {
            this.playPrevTrack();
          }
        }
      });
    });
  }

  // 为当前正在播放的视频，音频，提供元数据来自定义媒体通知
  // Navigator.mediaSession:https://developer.mozilla.  org/en-US/docs/Web/API/Navigator/mediaSession
  _updateMediaSessionMetaData(track) {
    if ("mediaSession" in navigator === false) {
      return;
    }
    let artists = track.ar.map((a) => a.name);
    const metadata = {
      title: track.name,
      artist: artists.join(","),
      album: track.al.name,
      artwork: [
        {
          src: track.al.picUrl + "?param=512y512",
          type: "image/jpg",
          sizes: "512x512",
        },
      ],
      length: this.currentTrackDuration,
      trackId: this.current,
    };
    navigator.mediaSession.metadata = new window.MediaMetadata(metadata);
  }

  // 获取单曲播放url
  _getAudioSource(track) {
    return this._getAudioSourceFromNetease(track).then((source) => {
      console.log("_getAudioSource", source);
      return source;
    });
  }

  // 从网易云api获取单曲播放url
  _getAudioSourceFromNetease(track) {
    // return getMusicUrl(track.id).then((result) => {
    //   if (!result.data[0]) return null;
    //   if (!result.data[0].url) return null;
    //   if (result.data[0].freeTrialInfo !== null) return null; // 跳过只能试听的歌曲
    //   const source = result.data[0].url.replace(/^http:/, "https:");
    //   console.log("_getAudioSourceFromNetease", source);
    //   return source;
    // });
    return new Promise((resolve) => {
      resolve(`https://music.163.com/song/media/outer/url?id=${track.id}`);
    });
  }

  _playAudioSource(source, autoplay = true) {
    Howler.unload();
    this._howler = new Howl({
      src: [source],
      html5: true,
      format: ["mp3", "flac"],
    });
    if (autoplay) {
      this.play();
      if (this._currentTrack.name) {
        setTitle(this._currentTrack);
      }
    }
  }
  // 缓存下一首歌曲
  _cacheNextTrack() {
    let nextTrackID = this._getNextTrack()[0];
    if (!nextTrackID) return;
    getTrackDetail(nextTrackID).then((data) => {
      let track = data.songs[0];
      this._getAudioSource(track);
    });
  }
  // 获取下一首歌曲信息
  _getNextTrack() {
    const next = this.current + 1;
    if (this._playNextList.length > 0) {
      let trackID = this._playNextList.shift();
      return [trackID, this.current];
    }

    return [this.list[next], next];
  }
  // 获取上一首歌曲信息
  _getPrevTrack() {
    const next = this.current - 1;
    if (this.list.length === this.current + 1) {
      return [this.list[this.list.length - 1], this.list.length - 1];
    }
    return [this.list[next], next];
  }

  _initMediaSession() {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => {
        this.play();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        this.pause();
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        this.playPrevTrack();
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        this.playNextTrack();
      });
      //TODO:播放条拖动
    }
  }

  // 播放下一首歌曲
  playNextTrack() {
    const [trackID, index] = this._getNextTrack();
    if (trackID === undefined) {
      this._howler?.stop();
      this._setPlaying(false);
      return false;
    }
    this.current = index;
    this._replaceCurrentTrack(trackID);
    return true;
  }
  // 播放上一首歌曲
  playPrevTrack() {
    const [trackID, index] = this._getPrevTrack();
    if (trackID === undefined) return false;
    this.current = index;
    this._replaceCurrentTrack(trackID, true, "playPrevTrack");
    return true;
  }
  // 播放
  play() {
    if (this._howler?.playing()) return;
    this._howler?.play();
    this._setPlaying(true);
    if (this._currentTrack.name) {
      setTitle(this._currentTrack);
    }
  }
  // 暂停
  pause() {
    this._howler?.pause();
    this._setPlaying(false);
    setTitle(null);
  }
  // 寻找、设置播放位置
  seek(time = null) {
    if (time !== null) {
      this._howler?.seek(time);
    }
    return this._howler === null ? 0 : this._howler.seek();
  }
  playOrPause() {
    if (this._howler?.playing()) {
      this.pause();
    } else {
      this.play();
    }
  }
  // 开启、关闭静音
  mute() {
    if (this.volume === 0) {
      this.volume = this._volumeBeforeMuted;
    } else {
      this._volumeBeforeMuted = this.volume;
      this.volume = 0;
    }
  }
  // 更新播放列表
  replacePlaylist(
    trackIDs,
    playlistSourceID,
    playlistSourceType,
    autoPlayTrackID = "first"
  ) {
    if (!this._enabled) this._enabled = true;
    this.list = trackIDs;
    this.current = 0;
    this._playlistSource = {
      type: playlistSourceType,
      id: playlistSourceID,
    };
    // if (this.shuffle) this._shuffleTheList(autoPlayTrackID);
    if (autoPlayTrackID === "first") {
      this._replaceCurrentTrack(this.list[0]);
    } else {
      this.current = trackIDs.indexOf(autoPlayTrackID);
      this._replaceCurrentTrack(autoPlayTrackID);
    }
  }

  // 按照播放列表播放
  playPlaylistByID(id, trackID = "first", noCache = false) {
    console.debug(
      `[debug][Player.js] playPlaylistByID 👉 id:${id} trackID:${trackID} noCache:${noCache}`
    );
    getPlaylistDetail(id, noCache).then((data) => {
      let trackIDs = data.playlist.trackIds.map((t) => t.id);
      this.replacePlaylist(trackIDs, id, "playlist", trackID);
    });
  }

  // 缓存播放列表
  saveSelfToLocalStorage() {
    let player = {};
    for (let [key, value] of Object.entries(this)) {
      // if (key !== _playing) continue;
      player[key] = value;
    }

    // window.localStorage.setItem('player', JSON.stringify(player));
  }
}
