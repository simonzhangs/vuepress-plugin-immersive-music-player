<template>
  <!-- 页面底部播放控件 -->
  <div class="player" @click="toggleLyrics">
    <!-- 播放进度条 -->
    <div class="progress-bar" :class="barStyle" @click.stop>
      <vue-slider
        v-model="progress"
        :min="0"
        :max="currentTrackDuration"
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
      <!-- 左侧部分控件 -->
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
            <ButtonIcon
              title="喜欢"
              @click.native="likeATrack(currentTrack.id)"
            >
              <div v-show="!isCurrentTrackLiked">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                  <path
                    d="M 9.5449219 3 C 5.3895807 3 2 6.3895806 2 10.544922 C 2 14.283156 4.9005496 18.084723 7.6601562 21.119141 C 10.419763 24.153558 13.171875 26.369141 13.171875 26.369141 A 1.0001 1.0001 0 0 0 13.197266 26.388672 C 13.517448 26.630481 13.956962 26.684854 14.369141 26.785156 A 1.0001 1.0001 0 0 0 15 27 A 1.0001 1.0001 0 0 0 15.630859 26.785156 C 16.043038 26.684854 16.482552 26.630481 16.802734 26.388672 A 1.0001 1.0001 0 0 0 16.828125 26.369141 C 16.828125 26.369141 19.580237 24.153558 22.339844 21.119141 C 25.099451 18.084722 28 14.283156 28 10.544922 C 28 6.3895806 24.610419 3 20.455078 3 C 17.450232 3 15.833405 4.5910542 15 5.5664062 C 14.166595 4.5910543 12.549768 3 9.5449219 3 z M 9.5449219 5 C 12.372924 5 14.069642 7.4290597 14.126953 7.5117188 A 1.0001 1.0001 0 0 0 14.910156 8.0078125 A 1.0001 1.0001 0 0 0 15.003906 8.0117188 A 1.0001 1.0001 0 0 0 15.019531 8.0117188 A 1.0001 1.0001 0 0 0 15.042969 8.0097656 A 1.0001 1.0001 0 0 0 15.119141 8.0039062 A 1.0001 1.0001 0 0 0 15.871094 7.5136719 C 15.925786 7.4347249 17.624838 5 20.455078 5 C 23.529737 5 26 7.4702629 26 10.544922 C 26 13.147688 23.499768 16.870104 20.859375 19.773438 C 18.227966 22.666891 15.607768 24.780451 15.589844 24.794922 C 15.414236 24.925626 15.219097 25 15 25 C 14.780903 25 14.585764 24.925626 14.410156 24.794922 C 14.392232 24.780451 11.772034 22.66689 9.140625 19.773438 C 6.5002316 16.870105 4 13.147688 4 10.544922 C 4 7.4702629 6.470263 5 9.5449219 5 z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div v-show="player.isCurrentTrackLiked">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                  <path
                    d="M15,26c-0.21,0-0.42-0.066-0.597-0.198C13.938,25.456,3,17.243,3,11c0-3.859,3.141-7,7-7c2.358,0,4.062,1.272,5,2.212 C15.938,5.272,17.642,4,20,4c3.859,0,7,3.14,7,7c0,6.243-10.938,14.456-11.403,14.803C15.42,25.934,15.21,26,15,26z"
                    fill="currentColor"
                  />
                </svg>
              </div>
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
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="step-backward"
              class="svg-inline--fa fa-step-backward fa-w-14"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M64 468V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v176.4l195.5-181C352.1 22.3 384 36.6 384 64v384c0 27.4-31.9 41.7-52.5 24.6L136 292.7V468c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12z"
              ></path>
            </svg>
          </ButtonIcon>
          <ButtonIcon
            class="play"
            :title="playing ? '暂停' : '开始'"
            @click.native="playOrPause"
          >
            <div v-if="!playing">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="play"
                class="svg-inline--fa fa-play fa-w-14"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
                ></path>
              </svg>
            </div>

            <div v-else>
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="pause"
                class="svg-inline--fa fa-pause fa-w-14"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"
                ></path>
              </svg>
            </div>
          </ButtonIcon>
          <ButtonIcon title="下一首" @click.native="playNextTrack">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="step-forward"
              class="svg-inline--fa fa-step-forward fa-w-14"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z"
              ></path>
            </svg>
          </ButtonIcon>
        </div>
        <div class="blank"></div>
      </div>
      <!-- 右侧部分控件 -->
      <div class="right-control-buttons">
        <div class="blank"></div>
        <div class="container" @click.stop>
          <div class="replace" title="替换歌单" :class="{ active: inputFocus }">
            <svg
              t="1649296379570"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1956"
              width="64"
              height="64"
            >
              <path
                d="M243.456 371.541a42.667 42.667 0 0 1-60.33-60.33l170.666-170.667c26.88-26.88 72.832-7.85 72.832 30.165v682.667a42.667 42.667 0 0 1-85.333 0v-579.67l-97.835 97.835z m439.21 378.752l97.835-97.834a42.667 42.667 0 0 1 60.331 60.33L670.165 883.456c-26.88 26.88-72.832 7.85-72.832-30.165V170.624a42.667 42.667 0 0 1 85.334 0v579.67z"
                p-id="1957"
              ></path>
            </svg>
            <input
              ref="input"
              type="number"
              name="替换歌单"
              v-model="replaceID"
              @keyup.enter.stop="replacePlaylistID"
              @focus="
                inputFocus = true;
                isTipShow = true;
              "
              @blur="inputFocus = false"
              placeholder="替换歌单"
            />
            <div class="tip" v-show="isTipShow">
              <ul ref="recommendList">
                <li>飙升榜</li>
                <li>新歌榜</li>
                <li>云音乐民谣榜</li>
                <li>美国Billboard榜</li>
                <li>UK排行榜周榜</li>
              </ul>
            </div>
          </div>
          <ButtonIcon
            title="播放列表"
            :class="{
              active: $route.name === 'next',
              disabled: player.isPersonalFM,
            }"
            @click.native="goToNextTracksPage"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="list-music"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="svg-inline--fa fa-list-music fa-w-16 fa-9x"
            >
              <path
                fill="currentColor"
                d="M16 256h256a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm0-128h256a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16H16A16 16 0 0 0 0 80v32a16 16 0 0 0 16 16zm128 192H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM470.94 1.33l-96.53 28.51A32 32 0 0 0 352 60.34V360a148.76 148.76 0 0 0-48-8c-61.86 0-112 35.82-112 80s50.14 80 112 80 112-35.82 112-80V148.15l73-21.39a32 32 0 0 0 23-30.71V32a32 32 0 0 0-41.06-30.67z"
                class=""
              ></path>
            </svg>
          </ButtonIcon>
          <ButtonIcon
            :class="{
              active: player._repeatMode !== 'off',
            }"
            :title="player._repeatMode === 'one' ? '单曲' : '循环'"
            @click.native="switchRepeatMode"
          >
            <div v-show="player._repeatMode !== 'one'">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="repeat"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="svg-inline--fa fa-repeat fa-w-16 fa-1x"
              >
                <path
                  fill="currentColor"
                  d="M512 256c0 88.224-71.775 160-160 160H170.067l34.512 32.419c9.875 9.276 10.119 24.883.539 34.464l-10.775 10.775c-9.373 9.372-24.568 9.372-33.941 0l-92.686-92.686c-9.373-9.373-9.373-24.568 0-33.941l92.686-92.686c9.373-9.373 24.568-9.373 33.941 0l10.775 10.775c9.581 9.581 9.337 25.187-.539 34.464L170.067 352H352c52.935 0 96-43.065 96-96 0-13.958-2.996-27.228-8.376-39.204-4.061-9.039-2.284-19.626 4.723-26.633l12.183-12.183c11.499-11.499 30.965-8.526 38.312 5.982C505.814 205.624 512 230.103 512 256zM72.376 295.204C66.996 283.228 64 269.958 64 256c0-52.935 43.065-96 96-96h181.933l-34.512 32.419c-9.875 9.276-10.119 24.883-.539 34.464l10.775 10.775c9.373 9.372 24.568 9.372 33.941 0l92.686-92.686c9.373-9.373 9.373-24.568 0-33.941l-92.686-92.686c-9.373-9.373-24.568-9.373-33.941 0L306.882 29.12c-9.581 9.581-9.337 25.187.539 34.464L341.933 96H160C71.775 96 0 167.776 0 256c0 25.897 6.186 50.376 17.157 72.039 7.347 14.508 26.813 17.481 38.312 5.982l12.183-12.183c7.008-7.008 8.786-17.595 4.724-26.634z"
                  class=""
                ></path>
              </svg>
            </div>
            <div v-show="player._repeatMode === 'one'">
              <span class="dn color-inherit link hover-indigo"
                ><svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="repeat-1"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  class="svg-inline--fa fa-repeat-1 fa-w-16 fa-1x"
                >
                  <path
                    fill="currentColor"
                    d="M512 256c0 88.224-71.775 160-160 160H170.067l34.512 32.419c9.875 9.276 10.119 24.883.539 34.464l-10.775 10.775c-9.373 9.372-24.568 9.372-33.941 0l-92.686-92.686c-9.373-9.373-9.373-24.568 0-33.941l80.269-80.27c9.373-9.373 24.568-9.373 33.941 0l10.775 10.775c9.581 9.581 9.337 25.187-.539 34.464l-22.095 20H352c52.935 0 96-43.065 96-96 0-13.958-2.996-27.228-8.376-39.204-4.061-9.039-2.284-19.626 4.723-26.633l12.183-12.183c11.499-11.499 30.965-8.526 38.312 5.982C505.814 205.624 512 230.103 512 256zM72.376 295.204C66.996 283.228 64 269.958 64 256c0-52.935 43.065-96 96-96h181.933l-22.095 20.002c-9.875 9.276-10.119 24.883-.539 34.464l10.775 10.775c9.373 9.372 24.568 9.372 33.941 0l80.269-80.27c9.373-9.373 9.373-24.568 0-33.941l-92.686-92.686c-9.373-9.373-24.568-9.373-33.941 0l-10.775 10.775c-9.581 9.581-9.337 25.187.539 34.464L341.933 96H160C71.775 96 0 167.776 0 256c0 25.897 6.186 50.376 17.157 72.039 7.347 14.508 26.813 17.481 38.312 5.982l12.183-12.183c7.008-7.008 8.786-17.595 4.724-26.634zm154.887 4.323c0-7.477 3.917-11.572 11.573-11.572h15.131v-39.878c0-5.163.534-10.503.534-10.503h-.356s-1.779 2.67-2.848 3.738c-4.451 4.273-10.504 4.451-15.666-1.068l-5.518-6.231c-5.342-5.341-4.984-11.216.534-16.379l21.72-19.939c4.449-4.095 8.366-5.697 14.42-5.697h12.105c7.656 0 11.749 3.916 11.749 11.572v84.384h15.488c7.655 0 11.572 4.094 11.572 11.572v8.901c0 7.477-3.917 11.572-11.572 11.572h-67.293c-7.656 0-11.573-4.095-11.573-11.572v-8.9z"
                    class=""
                  ></path></svg
              ></span>
            </div>
          </ButtonIcon>
          <ButtonIcon
            :class="{ active: player._shuffle }"
            title="循环"
            @click.native="switchShuffle"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="random"
              class="svg-inline--fa fa-random fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M504.971 359.029c9.373 9.373 9.373 24.569 0 33.941l-80 79.984c-15.01 15.01-40.971 4.49-40.971-16.971V416h-58.785a12.004 12.004 0 0 1-8.773-3.812l-70.556-75.596 53.333-57.143L352 336h32v-39.981c0-21.438 25.943-31.998 40.971-16.971l80 79.981zM12 176h84l52.781 56.551 53.333-57.143-70.556-75.596A11.999 11.999 0 0 0 122.785 96H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12zm372 0v39.984c0 21.46 25.961 31.98 40.971 16.971l80-79.984c9.373-9.373 9.373-24.569 0-33.941l-80-79.981C409.943 24.021 384 34.582 384 56.019V96h-58.785a12.004 12.004 0 0 0-8.773 3.812L96 336H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h110.785c3.326 0 6.503-1.381 8.773-3.812L352 176h32z"
              ></path>
            </svg>
          </ButtonIcon>
          <ButtonIcon
            v-if="enableReversedMode"
            :class="{
              active: player._reversed,
            }"
            title="倒序"
            @click.native="switchReversed"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="sort-amount-up"
              class="svg-inline--fa fa-sort-amount-up fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M304 416h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM16 160h48v304a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V160h48c14.21 0 21.38-17.24 11.31-27.31l-80-96a16 16 0 0 0-22.62 0l-80 96C-5.35 142.74 1.77 160 16 160zm416 0H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-64 128H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM496 32H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
              ></path>
            </svg>
          </ButtonIcon>
          <div class="volume-control">
            <ButtonIcon title="静音" @click.native="mute">
              <div v-if="volume > 0.5">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="volume"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 480 512"
                  class="svg-inline--fa fa-volume fa-w-15 fa-2x"
                >
                  <path
                    fill="currentColor"
                    d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.53 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z"
                    class=""
                  ></path>
                </svg>
              </div>
              <div v-else-if="volume === 0">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="volume-mute"
                  class="svg-inline--fa fa-volume-mute fa-w-16"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM461.64 256l45.64-45.64c6.3-6.3 6.3-16.52 0-22.82l-22.82-22.82c-6.3-6.3-16.52-6.3-22.82 0L416 210.36l-45.64-45.64c-6.3-6.3-16.52-6.3-22.82 0l-22.82 22.82c-6.3 6.3-6.3 16.52 0 22.82L370.36 256l-45.63 45.63c-6.3 6.3-6.3 16.52 0 22.82l22.82 22.82c6.3 6.3 16.52 6.3 22.82 0L416 301.64l45.64 45.64c6.3 6.3 16.52 6.3 22.82 0l22.82-22.82c6.3-6.3 6.3-16.52 0-22.82L461.64 256z"
                  ></path>
                </svg>
              </div>
              <div v-else-if="volume <= 0.5 && volume !== 0">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="volume-down"
                  class="svg-inline--fa fa-volume-down fa-w-12"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path
                    fill="currentColor"
                    d="M215.03 72.04L126.06 161H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V89.02c0-21.47-25.96-31.98-40.97-16.98zm123.2 108.08c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 229.28 336 242.62 336 257c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.87z"
                  ></path>
                </svg>
              </div>
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
            <svg
              enable-background="new 0 0 32 32"
              height="32px"
              id="Layer_1"
              version="1.1"
              viewBox="0 0 32 32"
              width="32px"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <path
                d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z"
                fill="currentColor"
              />
            </svg>
          </ButtonIcon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component/dist-css/vue-slider-component.umd.min.js";
import "vue-slider-component/dist-css/vue-slider-component.css";
// import theme
import "vue-slider-component/theme/default.css";
import "./css/slider.css";

import ButtonIcon from "./components/ButtonIcon.vue";

import { Howler, Howl } from "howler";
import { getTrackDetail, getMusicUrl, getPlaylistDetail } from "./api/music";
import { throttle, randomShuffle } from "./utils/common";

let { sliderStyle, playListID, ...paths } = MUSICBAR_OPTIONS;

export default {
  name: "Player",
  components: {
    ButtonIcon,
    VueSlider,
  },
  data() {
    return {
      player: {
        _playing: false, // 是否正在播放中
        _progress: 0, // 当前播放歌曲的进度
        _enabled: false, // 是否启用Player
        _repeatMode: "off", // off | on | one
        _shuffle: false,
        _reversed: false,
        _volume: 1, // 0 to 1
        _volumeBeforeMuted: 1, // 用于保存静音前的音量

        _list: [], // 播放列表
        _shuffledList: [], // 被随机打乱的播放列表，随机播放模式下会使用此播放列表
        _current: 0, // 当前播放歌曲在播放列表里的index
        _playlistSource: { type: "album", id: 123 }, // 当前播放列表的信息
        _currentTrack: { id: 86827685 }, // 当前播放歌曲的详细信息
        _playNextList: [], // 当这个list不为空时，会优先播放这个list的歌

        // howler (https://github.com/goldfire/howler.js)
        _howler: null,
      },
      sliderStyle: {
        isNyancat: false,
        isRainbow: false,
        isSpitRainbow: false,
        isMario: false,
      },
      showLyrics: false,
      enableReversedMode: true,
      replaceID: "", // 飙升榜歌单
      //推荐歌单
      inputFocus: false,
      isTipShow: false,
    };
  },
  computed: {
    currentTrack() {
      console.log("currentTrack() ", this.player._currentTrack);
      return this.player._currentTrack;
    },
    barStyle() {
      // 样式判断
      if (this.sliderStyle.isMario) {
        return {
          mario: true,
          "mario-stop": this.sliderStyle.isMario && !this.player._playing,
        };
      }
      if (this.sliderStyle.isSpitRainbow) {
        return {
          spitRainbow: true,
          "spitRainbow-stop":
            this.sliderStyle.isSpitRainbow && !this.player._playing,
        };
      }
      if (this.sliderStyle.isRainbow) {
        return {
          rainbow: true,
          "rainbow-stop": this.sliderStyle.isRainbow && !this.player._playing,
        };
      }
      if (this.sliderStyle.isNyancat) {
        return {
          nyancat: true,
          "nyancat-stop": this.sliderStyle.isNyancat && !this.player._playing,
        };
      }
    },
    volume: {
      get() {
        return this.player._volume;
      },
      set(value) {
        this.player._volume = value;
        Howler.volume(value);
      },
    },
    list: {
      get() {
        return this.player._shuffle ? this.player._shuffledList : this.player._list;
      },
      set(list) {
        this.player._list = list;
      },
    },
    current: {
      get() {
        return this.player._current;
      },
      set(current) {
        this.player._current = current;
      },
    },
    enabled() {
      return this.player._enabled;
    },
    playing() {
      return this.player._playing;
    },
    playlistSource() {
      return this.player._playlistSource;
    },
    playNextList() {
      return this.player._playNextList;
    },
    progress: {
      get() {
        return this.player._progress;
      },
      set(value) {
        if (this.player._howler) {
          this.player._howler.seek(value);
        }
      },
    },
    currentTrackDuration() {
      const trackDuration = this.player._currentTrack.dt || 1000;
      let duration = ~~(trackDuration / 1000);
      return duration > 1 ? duration - 1 : duration;
    },
    audioSource() {
      return this.player._howler?._src.includes("kuwo.cn")
        ? "音源来自酷我音乐"
        : "";
    },
    // 循环播放模式
    repeatMode: {
      get() {
        return this.player._repeatMode;
      },
      set(mode) {
        if (!["off", "on", "one"].includes(mode)) {
          console.warn(
            "repeatMode: invaild args, must be 'on' | 'off' | 'one'"
          );
          return;
        }
        this.player._repeatMode = mode;
      },
    },
    // 随机播放模式 
    shuffle: {
      get() {
        return this.player._shuffle;
      },
      set(isShuffle) {
         this.player._shuffle = isShuffle;
         if (isShuffle) {
            this.shuffleList();
         }
      }
    }
  },
  created() {
    // 此时可以访问this，做数据初始化；或者异步数据请求
    this.init();
    this.playPlaylistByID((playListID = 4989640759));
    if (sliderStyle.theme === "isRainbow") {
      this.sliderStyle.isRainbow = true;
    }
    if (sliderStyle.theme === "isNyancat") {
      this.sliderStyle.isNyancat = true;
    }
    if (sliderStyle.theme === "isSpitRainbow") {
      this.sliderStyle.isSpitRainbow = true;
    }
    if (sliderStyle.theme === "isMario") {
      this.sliderStyle.isMario = true;
    }
  },
  mounted() {
    // 绑定搜索推荐事件
    this.recommendListBind();
  },
  methods: {
    init() {
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
    },
    // ul的每个li绑定时间
    recommendListBind() {
      let li = this.$refs.recommendList.querySelectorAll("li");
      // console.log('li',li);
      for (let i = 0; i < li.length; i++) {
        li[i].onclick = () => {
          this.getRecommendPlaylistID(li[i].innerText);
          this.$refs.input.focus();
        };
      }
    },
    getRecommendPlaylistID(text) {
      if (text === "飙升榜") {
        this.replaceID = 19723756;
      }
      if (text === "新歌榜") {
        this.replaceID = 3779629;
      }
      if (text === "美国Billboard榜") {
        this.replaceID = 60198;
      }
      if (text === "UK排行榜周榜") {
        this.replaceID = 180106;
      }
      if (text === "云音乐民谣榜") {
        this.replaceID = 5059661515;
      }
    },
    // 替换推荐歌单
    replacePlaylistID() {
      this.playPlaylistByID(this.replaceID);
      this.replaceID = "";
      this.$refs.input.blur();
      this.isTipShow = false;
    },
    toggleLyrics() {
      this.showLyrics = !this.showLyrics;
    },
    likeATrack() {
      //TODO:收藏
    },
    playNextTrack() {
      throttle(this.playNextTrack(), 1000);
    },
    playPrevTrack() {
      throttle(this.playPrevTrack(), 1000);
    },
    switchReversed() {
      this.switchReversed();
    },
    goToNextTracksPage() {
      //TODO
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
    switchRepeatMode() {
      if (this.player._repeatMode === "on") {
        this.repeatMode = "one";
      } else if (this.player._repeatMode === "one") {
        this.repeatMode = "off";
      } else {
        this.repeatMode = "on";
      }
    },
    switchShuffle() {
      this.shuffle = !this._shuffle;
    },
    switchReversed() {
      this.player._reversed = !this.player._reversed;
    },
    async shuffleList(firstTrackID = this.player._currentTrack.id) {
      let list = this.player._list.filter(tid => tid !== firstTrackID);
      if (firstTrackID === 'first') list = this.player._list;
      this.player._shuffledList = randomShuffle(list);
      if (firstTrackID !== 'first') this.player._shuffledList.unshift(firstTrackID);
    },
    isCurrentTrackLiked() {
      // TODO
    },

    _setPlaying(isPlaying) {
      this.player._playing = isPlaying;
    },

    _setIntervals() {
      setInterval(() => {
        if (this.player._howler === null) return;
        this.player._progress = this.player._howler.seek();
        // window.localStorage.setItem("playerCurrentTrackTime", this._progress);
      }, 1000);
    },
    //player 实例对象从缓存读取
    _loadSelfFromLocalStorage() {
      // const player = JSON.parse(localStorage.getItem("player"));
      const player = null;
      if (!player) return;
      for (const [key, value] of Object.entries(player)) {
        this[key] = value;
      }
    },
    // 更换当前播放单曲
    _replaceCurrentTrack(
      id,
      autoplay = true,
      ifUnplayableThen = "playNextTrack"
    ) {
      return getTrackDetail(id).then((data) => {
        let track = data.songs[0];
        this.player._currentTrack = track;
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
    },

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
    },

    // 获取单曲播放url
    _getAudioSource(track) {
      return this._getAudioSourceFromNetease(track).then((source) => {
        console.log("_getAudioSource", source);
        return source;
      });
    },

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
    },

    _playAudioSource(source, autoplay = true) {
      Howler.unload();
      this.player._howler = new Howl({
        src: [source],
        html5: true,
        format: ["mp3", "flac"],
        onend: () => {
          this._nextTrackCallback();
        },
      });
      console.log(this.player._howler);
      // fix：对于网易云请求不到的资源，跳过
      setTimeout(() => {
        if (!this.player?._howler?._duration) {
          this.playNextTrack();
        }
      }, 5000);
      if (autoplay) {
        this.play();
        if (this.player._currentTrack.name) {
          this.setTitle(this.player._currentTrack);
        }
      }
    },
    // 缓存下一首歌曲
    _cacheNextTrack() {
      let nextTrackID = this._getNextTrack()[0];
      if (!nextTrackID) return;
      getTrackDetail(nextTrackID).then((data) => {
        let track = data.songs[0];
        this._getAudioSource(track);
      });
    },
    // 获取下一首歌曲信息
    _getNextTrack() {
      const next = this.player._reversed ? this.current - 1 : this.current + 1;

      if (this.player._playNextList.length > 0) {
        let trackID = this.player._playNextList.shift();
        return [trackID, this.current];
      }

      if (this.repeatMode === 'on') {
        if (this.player._reversed && this.player._current === 0) {
          return [this.list[this.list.length - 1], this.list.length - 1];
        }else if (this.list.length === this.player._current + 1){
          return [this.list[0], 0];
        }
      }

      return [this.list[next], next];
    },
    // 获取上一首歌曲信息
    _getPrevTrack() {
      const next = this.player._reversed ? this.current + 1 : this.current - 1;

      if (this.list.length === this.current + 1) {
        return [this.list[this.list.length - 1], this.list.length - 1];
      }
      // 循环模式开启，则重新播放当前模式下的相对的下一首
      if (this.repeatMode === 'on') {
        if (this.player._reversed && this.current === 0) {
          // 倒序模式，当前歌曲是最后一首，则重新播放列表第一首
          return [this.list[0], 0];
        } else if (this.list.length === this.current + 1) {
          // 正序模式，当前歌曲是第一首，则重新播放列表最后一首
          return [this.list[this.list.length - 1], this.list.length - 1];
        }
      }
      // 返回 [trackID, index]
      return [this.list[next], next];
    },
    // 自动播放下一首
    _nextTrackCallback() {
      if (this.player._repeatMode === "one") {
        this._replaceCurrentTrack(this.player._currentTrack.id);
      } else {
        this.playNextTrack();
      }
    },

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
    },

    // 设置浏览器tab栏信息
    setTitle(track) {
      document.title = track
        ? `${track.name} · ${track.ar[0].name} - vuepress-plugin-music-player`
        : "vuepress-plugin-music-player";
    },

    // 播放下一首歌曲
    playNextTrack() {
      const [trackID, index] = this._getNextTrack();
      if (trackID === undefined) {
        this.player._howler?.stop();
        this._setPlaying(false);
        return false;
      }
      this.current = index;
      this._replaceCurrentTrack(trackID);
      return true;
    },
    // 播放上一首歌曲
    playPrevTrack() {
      const [trackID, index] = this._getPrevTrack();
      if (trackID === undefined) return false;
      this.current = index;
      this._replaceCurrentTrack(trackID, true, "playPrevTrack");
      return true;
    },
    // 播放
    play() {
      // if (this.player._howler?.playing())  return;
      this.player._howler?.play();
      this._setPlaying(true);
      if (this.player._currentTrack.name) {
        this.setTitle(this.player._currentTrack);
      }
    },
    // 暂停
    pause() {
      this.player._howler?.pause();
      this._setPlaying(false);
      this.setTitle(null);
    },
    // 寻找、设置播放位置
    seek(time = null) {
      if (time !== null) {
        this.player._howler?.seek(time);
      }
      return this.player._howler === null ? 0 : this.player._howler.seek();
    },
    playOrPause() {
      if (this.player._howler?.playing()) {
        this.pause();
      } else {
        this.play();
      }
    },
    // 开启、关闭静音
    mute() {
      if (this.player._volume === 0) {
        this.player._volume = this.player._volumeBeforeMuted;
        Howler.volume(this.player._volumeBeforeMuted);
      } else {
        this.player._volumeBeforeMuted = this.player._volume;
        this.player._volume = 0;
        Howler.volume(0);
      }
    },
    // 更新播放列表
    replacePlaylist(
      trackIDs,
      playlistSourceID,
      playlistSourceType,
      autoPlayTrackID = "first"
    ) {
      if (!this.player._enabled) this.player._enabled = true;
      this.player._list = trackIDs;
      this.player._current = 0;
      this.player._playlistSource = {
        type: playlistSourceType,
        id: playlistSourceID,
      };
      if (this.player._shuffle) this.shuffleList(autoPlayTrackID);
      if (autoPlayTrackID === "first") {
        this._replaceCurrentTrack(this.player._list[0]);
      } else {
        this.player._current = trackIDs.indexOf(autoPlayTrackID);
        this._replaceCurrentTrack(autoPlayTrackID);
      }
    },

    // 按照播放列表播放
    playPlaylistByID(id, trackID = "first", noCache = false) {
      console.debug(
        `[debug][player.vue] playPlaylistByID 👉 id:${id} trackID:${trackID} noCache:${noCache}`
      );
      getPlaylistDetail(id, noCache).then((data) => {
        let trackIDs = data.playlist.trackIds.map((t) => t.id);
        this.replacePlaylist(trackIDs, id, "playlist", trackID);
      });
    },

    // 缓存播放列表
    saveSelfToLocalStorage() {
      let player = {};
      for (let [key, value] of Object.entries(this)) {
        // if (key !== _playing) continue;
        player[key] = value;
      }

      // window.localStorage.setItem('player', JSON.stringify(player));
    },
  },
};
</script>

<style>
@import url("./css/player.css");
@import url("./css/playermobile.css");
</style>
