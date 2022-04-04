import request from "../utils/request";

// 获取歌曲详情
export const getTrackDetail = (ids) => {
    return request({
        url: '/song/detail',
        method: 'get',
        params: {
            ids,
        }
    })
}

// 获取歌曲 url
export const getMusicUrl = (id) => {
    return request({
        url: '/song/url',
        method: 'get',
        params: {
            id,
        }
    })
}

// 获取播放歌单信息

// 歌曲是否能够播放
export function isTrackPlayable(track) {
  let result = {
    playable: true,
    reason: '',
  };
  if (track?.privilege?.pl > 0) {
    return result;
  }
  // cloud storage judgement logic
  if (track?.privilege?.cs) { //isAccountLoggedIn() && 
    return result;
  }
  if (track.fee === 1 || track.privilege?.fee === 1) {
    
      result.playable = false;
      result.reason = 'VIP Only';
  } else if (track.fee === 4 || track.privilege?.fee === 4) {
    result.playable = false;
    result.reason = '付费专辑';
  } else if (
    track.noCopyrightcmd !== null &&
    track.noCopyrightcmd !== undefined
  ) {
    result.playable = false;
    result.reason = '无版权';
  } else if (track.privilege?.st < 0 ) { // && isAccountLoggedIn()
    result.playable = false;
    result.reason = '已下架';
  }
  return result;
}

function mapTrackPlayableStatus(tracks, privileges = []) {
    if (tracks.length === undefined) return tracks;
    return tracks.map(t => {
      const privilege = privileges.find(item => item.id === t.id) || {};
      if (t.privilege) {
        Object.assign(t.privilege, privilege);
      } else {
        t.privilege = privilege;
      }
      let result = isTrackPlayable(t);
      t.playable = result.playable;
      t.reason = result.reason;
      return t;
    });
}

export function getPlaylistDetail(id, noCache = false) {
    let params = { id };
    if (noCache) params.timestamp = new Date().getTime();
    return request({
      url: '/playlist/detail',
      method: 'get',
      params,
    }).then(data => {
      if (data.playlist) {
        data.playlist.tracks = mapTrackPlayableStatus(
          data.playlist.tracks,
          data.privileges || []
        );
      }
      return data;
    });
  }