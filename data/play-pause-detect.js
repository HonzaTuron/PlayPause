//     This file is part of Play/Pause extension for Mozilla Firefox
//     https://github.com/DanielKamkha/PlayPauseFirefox
//     (c) 2015-2017 Daniel Kamkha
//     Play/Pause is free software distributed under the terms of the MIT license.

(function() {
  "use strict";

  const generalPlayers = [
    {  // YouTube HTML5 on-site
      regex: /.*youtube\.com.*/,
      selector: "button.ytp-play-button",
      indicatorSelector: "div.html5-video-player",
      playingClass: "playing-mode",
      waitForButton: true,
      create: PlayPause.SingleButtonGenericPlayer
    },
    {  // YouTube Flash on-site
      regex: /.*youtube\.com.*/,
      selector: "object, embed",
      srcRegex: /.*\.youtube\.com.*/,
      stateGetterName: "getPlayerState",
      playStateValue: 1,
      create: PlayPause.DirectAccessFlashPlayer
    },
    { // Last.fm
      regex: /.*\.last\.fm.*/,
      selector: "button.js-play-pause",
      playingClass: "player-bar-btn--pause",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Pandora (Ooyala Flash embedded)
      regex: /.*\.pandora\.com.*/,
      selector: "object, embed",
      srcRegex: /.*player\.ooyala\.com.*/,
      stateGetterName: "getState",
      playStateValue: "playing",
      playFuncName: "playMovie",
      pauseFuncName: "pauseMovie",
      create: PlayPause.DirectAccessFlashPlayer
    },
    { // SoundCloud on-site
      regex: /.*soundcloud\.com.*/,
      selector: "button.playControl",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Hype Machine
      regex: /.*hypem\.com.*/,
      selector: "#playerPlay",
      playingClass: "pause",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Amazon Music
      regex: /.*amazon\..*/,
      selector: ".acs-mp3-play, .acs-mp3-pause, div.sample-button",
      create: PlayPause.MultiButtonHtml5Player
    },
    { // Rdio
      regex: /.*rdio\.com.*/,
      selector: "button.play_pause",
      waitForButton: true,
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // 8tracks // probably broken
      regex: /.*8tracks\.com.*/,
      playButtonSelector: "#player_play_button",
      pauseButtonSelector: "#player_pause_button",
      waitForButton: true,
      create: PlayPause.TwoButtonGenericPlayer
    },
    {  // Twitch.tv on-site
      regex: /.*twitch\.tv.*/,
      selector: "button.player-button--playpause",
      indicatorSelector: "div.player",
      indicatorTypeAttribute: true,
      playingClass: "data-paused",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // MySpace
      regex: /.*myspace\.com.*/,
      selector: "button.play",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Silver.ru
      regex: /.*silver\.ru.*/,
      selector: "div.js-play-pause",
      create: PlayPause.MultiButtonHtml5Player
    },
    { // Deezer
      regex: /.*\.deezer\.com.*/,
      selector: "button.control-play",
      indicatorSelector: "button.control-play svg.svg-icon",
      playingClass: "svg-icon-pause",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Jango
      regex: /.*\.jango\.com.*/,
      selector: "#btn-playpause",
      playingClass: "pause",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // iHeartRadio
      regex: /.*\.iheart\.com.*/,
      selector: "button.playButton",
      playingClass: "play-PlayButton",
      invertedCheck: true,
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Slacker
      regex: /.*\.slacker\.com.*/,
      selector: "a.play",
      indicatorSelector: "li.playpause",
      playingClass: " play", // HACK: preceding space is important!
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Spotify
      regex: /.*open\.spotify\.com.*/,
      selector: "button.spoticon-play-16, button.spoticon-pause-16",
      playingClass: "spoticon-pause-16",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Pocket Casts
      regex: /.*play\.pocketcasts\.com.*/,
      selector: "div.play_pause_button",
      playingClass: " pause_button", // HACK: preceding space is important!
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Mixcloud
      regex: /.*\.mixcloud\.com.*/,
      selector: "div.player-control",
      playingClass: "pause-state",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Tidal
      regex: /.*listen\.tidal\.com.*/,
      playButtonSelector: "button.play-controls__play",
      pauseButtonSelector: "button.play-controls__pause",
      waitForButton: true,
      create: PlayPause.TwoButtonGenericPlayer
    },
    { // Gaana
      regex: /.*gaana\.com.*/,
      selector: "a.playPause",
      playingClass: " pause", // HACK: preceding space is important!
      waitForButton: true,
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Pleer.net
      regex: /.*pleer\.net.*/,
      selector: "#play",
      playingClass: "pause",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Google Play Music
      regex: /.*play\.google\.com\/music.*/,
      selector: "#player-bar-play-pause",
      playingClass: "playing",
      waitForButton: true,
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Yandex Music
      regex: /.*music\.yandex\.ru.*/,
      selector: "div.player-controls__btn_play",
      playingClass: " player-controls__btn_pause", // HACK: preceding space is important!
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // vk.com
      regex: /.*vk\.com.*/,
      selector: "button.top_audio_player_play",
      indicatorSelector: "#top_audio_player",
      playingClass: "top_audio_player_playing",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // TED talks
      regex: /.*www\.ted\.com.*/,
      playButtonSelector: "a.controls__play",
      pauseButtonSelector: "a.controls__pause",
      indicatorSelector: "div.controls",
      waitForButton: true,
      create: PlayPause.TwoButtonGenericPlayer
    },
    { // player.fm
      regex: /.*player\.fm.*/,
      playButtonSelector: "button.play",
      pauseButtonSelector: "button.pause",
      waitForButton: true,
      create: PlayPause.TwoButtonGenericPlayer
    },
    { // franceculture.fr
      regex: /.*franceculture\.fr.*/,
      selector: "#player button.player-button.play",
      playingClass: "playing",
      create: PlayPause.SingleButtonGenericPlayer
    },
    {  // Bandcamp
      selector: "a.play-btn, div.playbutton, span.item_link_play",
      create: PlayPause.MultiButtonHtml5Player
    }
  ];

  const embedPlayers = [
    {  // Twitch.tv embedded
      regex: /.*twitch\.tv.*/,
      selector: "button.player-button--playpause",
      indicatorSelector: "div.player",
      indicatorTypeAttribute: true,
      playingClass: "data-paused",
      create: PlayPause.SingleButtonGenericPlayer
    },
    {  // Ooyala Flash embedded
      selector: "object, embed",
      srcRegex: /.*player\.ooyala\.com.*/,
      stateGetterName: "getState",
      playStateValue: "playing",
      playFuncName: "playMovie",
      pauseFuncName: "pauseMovie",
      create: PlayPause.DirectAccessFlashPlayer
    },
    { // SoundCloud embedded
      selector: "button.playButton", // TODO: very bad condition, too generic
      create: PlayPause.SingleButtonGenericPlayer
    },
    {  // Generic catch-all HTML5 media
      selector: PlayPause.mediaSelector,
      create: PlayPause.ButtonlessHtml5Player
    }
  ];

  function detectPlayer(id, win) {
    // Test for win.document access, fail gracefully for unexpected iframes
    try {
      //noinspection JSUnusedLocalSymbols, JSHint
      let dummy = win.document;
    } catch (exception) {
      if (exception.message.toLowerCase().indexOf("permission denied") !== -1) {
        return null;
      } else {
        throw exception;
      }
    }

    let playerDataList = generalPlayers;
    if (PlayPause.options.doEmbeds) {
      playerDataList = generalPlayers.concat(embedPlayers);
    }
    for (let i = 0; i < playerDataList.length; i++) {
      let playerData = playerDataList[i];
      let player = null;
      if (!playerData.regex || playerData.regex.test(win.location.href)) {
        player = playerData.create.preCondition(win, playerData.selector, playerData) ?
          new playerData.create(id, win, playerData.selector, playerData) :
          null;
      }
      if (player) {
        return player;
      }
    }
    return null;
  }

  window.PlayPause = window.PlayPause || {};
  window.PlayPause.options = {};
  window.PlayPause.detectPlayer = detectPlayer;
})();
