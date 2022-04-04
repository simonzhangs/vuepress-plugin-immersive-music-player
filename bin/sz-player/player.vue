<template>
  <!-- 页面底部播放控件 -->
  <div class="player" @click="toggleLyrics">
    <!-- 播放进度条 -->
    <div
      class="progress-bar"
      :class="{
        nyancat: processBarStyle,
        'nyancat-stop': processBarStyle && !player.playing,
      }"
      @click.stop
    >
      <vue-slider
        v-model="player.progress"
        :min="0"
        :max="player.currentTrackDuration"
        :interval="1"
        :drag-on-click="true"
        :duration="0"
        dot-size="12"
        :height="2"
        :tooltip-formatter="formatTrackTime"
        :lazy="true"
        :silent="true"
      >
      </vue-slider>
    </div>
    <!-- 播放器控件 -->
    <div class="controls">
      <div class="playing">
        <div class="container" @click.stop>
          <!-- 图片-点击去专辑 -->
          <img :src="currentTrack.al && currentTrack.al.picUrl" />
          <!-- 歌曲信息- 名称-点击去歌单来源 歌手-点击去歌手主页 -->
          <div class="track-info" :title="audioSource">
            <div :class="['name']">
              <!-- { 'has-list': hasList()  -->
              {{ currentTrack.name }}
            </div>
            <div class="artist">
              <span
                v-for="(ar, index) in currentTrack.ar"
                :key="ar.id"
                @click="ar.id && goToArtist(ar.id)"
              >
                <span :class="{ ar: ar.id }">{{ ar.name }}</span>
                <span v-if="index !== currentTrack.ar.length - 1">,</span>
              </span>
            </div>
          </div>
          <div class="like-button">
            <ButtonIcon title="喜欢">
              <!-- @click.native="likeATrack(player.currentTrack.id)" -->
              <svg-icon
                v-show="!player.isCurrentTrackLiked"
                icon-class="heart"
              ></svg-icon>
              <svg-icon
                v-show="player.isCurrentTrackLiked"
                icon-class="heart-solid"
              >
              </svg-icon>
            </ButtonIcon>
          </div>
        </div>
        <div class="blank"></div>
      </div>
      <!-- 中间部分控件 -->
      <div class="middle-control-buttons">
        <div class="blank"></div>
        <div class="container" @click.stop>
          <ButtonIcon
            v-show="!player.isPersonalFM"
            title="上一首"
            @click.native="playPrevTrack"
          >
            <svg-icon icon-class="previous" />
          </ButtonIcon>
          <ButtonIcon
            v-show="player.isPersonalFM"
            title="不喜欢"
            @click.native="moveToFMTrash"
          >
            <svg-icon icon-class="thumbs-down" />
          </ButtonIcon>
          <ButtonIcon
            class="play"
            :title="player.playing ? '暂停' : '开始'"
            @click.native="playOrPause"
          >
            <svg-icon :icon-class="player.playing ? 'pause' : 'play'" />
          </ButtonIcon>
          <ButtonIcon title="下一首" @click.native="playNextTrack">
            <svg-icon icon-class="next" />
          </ButtonIcon>
        </div>
        <div class="blank"></div>
      </div>
      <!-- 右侧部分控件 -->
      <div class="right-control-buttons">
        <div class="blank"></div>
        <div class="container" @click.stop>
          <ButtonIcon
            title="播放列表"
            :class="{
              active: $route.name === 'next',
              disabled: player.isPersonalFM,
            }"
            @click.native="goToNextTracksPage"
          >
            <svg-icon icon-class="list" />
          </ButtonIcon>
          <ButtonIcon
            :class="{
              active: player.repeatMode !== 'off',
              disabled: player.isPersonalFM,
            }"
            :title="player.repeatMode === 'one' ? '单曲' : '循环'"
            @click.native="switchRepeatMode"
          >
            <svg-icon
              v-show="player.repeatMode !== 'one'"
              icon-class="repeat"
            />
            <svg-icon
              v-show="player.repeatMode === 'one'"
              icon-class="repeat-1"
            />
          </ButtonIcon>
          <ButtonIcon
            :class="{ active: player.shuffle, disabled: player.isPersonalFM }"
            title="循环"
            @click.native="switchShuffle"
          >
            <svg-icon icon-class="shuffle" />
          </ButtonIcon>
          <ButtonIcon
            v-if="enableReversedMode"
            :class="{
              active: player.reversed,
              disabled: player.isPersonalFM,
            }"
            title="倒序"
            @click.native="switchReversed"
          >
            <svg-icon icon-class="sort-up" />
          </ButtonIcon>
          <div class="volume-control">
            <ButtonIcon title="静音" @click.native="mute">
              <svg-icon v-show="volume > 0.5" icon-class="volume" />
              <svg-icon v-show="volume === 0" icon-class="volume-mute" />
              <svg-icon
                v-show="volume <= 0.5 && volume !== 0"
                icon-class="volume-half"
              />
            </ButtonIcon>
            <div class="volume-bar">
              <vue-slider
                v-model="volume"
                :min="0"
                :max="1"
                :interval="0.01"
                :drag-on-click="true"
                :duration="0"
                tooltip="none"
                :dot-size="12"
              >
              </vue-slider>
            </div>
          </div>

          <ButtonIcon
            class="lyrics-button"
            title="歌词"
            style="margin-left: 12px"
            @click.native="toggleLyrics"
          >
            <svg-icon icon-class="arrow-up" />
          </ButtonIcon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState, mapMutations, mapActions } from "vuex";
import "./css/slider.css";

import ButtonIcon from "./components/ButtonIcon.vue";
import SvgIcon from "./components/SvgIcon.vue";
import VueSlider from "vue-slider-component";
import Player from "./utils/Player";

var { processBarStyle = false, ...paths } = MUSICBAR_OPTIONS;

export default {
  name: "Player",
  components: {
    ButtonIcon,
    VueSlider,
    SvgIcon,
  },
  data() {
    let player = new Player();
    player = new Proxy(player, {
      set(target, prop, val) {
        target[prop] = val;
        if (prop === "_howler") return true;
        // target.saveSelfToLocalStorage();
        // target.sendSelfToIpcMain();
        return true;
      },
    });
    return {
      player,
      showLyrics: false,
      processBarStyle: true,
      enableReversedMode: true,
    };
  },
  computed: {
    // ...mapState(["player", "settings", "data"]),
    currentTrack() {
      console.log(this.player.currentTrack.al);
      return this.player.currentTrack;
    },
    volume: {
      get() {
        return this.player.volume;
      },
      set(value) {
        return (this.player.volume = value);
      },
    },
    playing() {
      return this.player.playing;
    },
    audioSource() {
      return this.player._howler?._src.includes("kuwo.cn")
        ? "音源来自酷我音乐"
        : "";
    },
  },
  created() {
    this.player.playPlaylistByID(6964020220);
  },
  watch: {
    $route: function(route) {
      for (let i in paths) {
        if (typeof i !== "string") return;
        if (match(i, route.path).matches) {
          console.log("watching is on");
          processBarStyle =
            MUSICBAR_OPTIONS[i].processBarStyle ||
            MUSICBAR_OPTIONS.processBarStyle ||
            false;
        }
      }
    },
  },
  methods: {
    // ...mapMutations(["toggleLyrics"]),
    toggleLyrics() {
      this.showLyrics = !this.showLyrics;
    },
    // ...mapActions(["showToast", "likeATrack"]),
    playNextTrack() {
      if (this.player.isPersonalFM) {
        this.player.playNextFMTrack();
      } else {
        this.player.playNextTrack();
      }
    },
    playPrevTrack() {
      this.player.playPrevTrack();
    },
    playOrPause() {
      this.player.playOrPause();
    },
    goToNextTracksPage() {
      if (this.player.isPersonalFM) return;
      this.$route.name === "next"
        ? this.$router.go(-1)
        : this.$router.push({ name: "next" });
    },
    formatTrackTime(value) {
      if (!value) return "";
      let min = ~~((value / 60) % 60);
      let sec = (~~(value % 60)).toString().padStart(2, "0");
      return `${min}:${sec}`;
    },

    goToArtist(id) {
      this.$router.push({ path: "/artist/" + id });
    },
    moveToFMTrash() {
      this.player.moveToFMTrash();
    },
    switchRepeatMode() {
      this.player.switchRepeatMode();
    },
    switchShuffle() {
      this.player.switchShuffle();
    },
    switchReversed() {
      this.player.switchReversed();
    },
    mute() {
      this.player.mute();
    },
  },
};
</script>

<style>
@import url("./css/player.css");
@import url("./css/playermobile.css");
</style>
