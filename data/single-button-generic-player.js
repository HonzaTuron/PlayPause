//     This file is part of Play/Pause extension for Mozilla Firefox
//     https://github.com/DanielKamkha/PlayPauseFirefox
//     (c) 2015-2017 Daniel Kamkha
//     Play/Pause is free software distributed under the terms of the MIT license.

(function() {
  "use strict";

  function checkPausedByClass(elem, playingClass) {
    return elem.getAttribute("class").indexOf(playingClass) === -1;
  }

  function checkPausedByAttribute(elem, attributeName) {
    return elem.getAttribute(attributeName) === "true";
  }

  function SingleButtonGenericPlayer(id, win, selector, playerData) {
    this._playFuncName = "click";
    this._pauseFuncName = "click";

    this._currentPlayer = win.document.querySelector(selector);
    this._observer = null;
    this._playingClass = playerData.playingClass || "playing";
    this._pausedChecker = playerData.indicatorTypeAttribute ? checkPausedByAttribute : checkPausedByClass;
    this._invertedCheck = playerData.invertedCheck;

    if (playerData.indicatorSelector) {
      this._indicator = win.document.querySelector(playerData.indicatorSelector);
    }

    let that = this;
    function initButtonObserver() {
      let indicator = that.getIndicator();
      if (indicator) {
        let attributeName = playerData.indicatorTypeAttribute ? that._playingClass : "class";
        that._observer = new MutationObserver(() => { PlayPause.emitStateChanged(id); });
        that._observer.observe(indicator, {attributes: true, attributeFilter: [attributeName]});
      }
    }

    if (!this._currentPlayer) {
      PlayPause.waitForElementPromise(selector, win.document.body)
        .then(function(elem) {
          that._currentPlayer = elem;
          initButtonObserver();
          PlayPause.emitStateChanged(id);
        }
      );
    } else {
      initButtonObserver();
    }

    if (playerData.indicatorSelector && !this._indicator) {
      PlayPause.waitForElementPromise(playerData.indicatorSelector, win.document.body)
        .then(function(elem) {
          that._indicator = elem;
          initButtonObserver();
          PlayPause.emitStateChanged(id);
        }
      );
    }
  }

  SingleButtonGenericPlayer.preCondition = function(win, selector, playerData) {
    return playerData.waitForButton || !!win.document.querySelector(selector);
  };
  SingleButtonGenericPlayer.prototype = Object.create(PlayPause.PlayerBase.prototype);

  Object.defineProperty(
    SingleButtonGenericPlayer.prototype,
    "paused",
    {
      get: function() {
        if (this._currentPlayer && this._currentPlayer.className.indexOf("disabled") === -1) {
          let pausedCheckerResult = this._pausedChecker(this.getIndicator(), this._playingClass);
          if (this._invertedCheck) {
            pausedCheckerResult = !pausedCheckerResult;
          }
          return pausedCheckerResult;
        } else {
          return null;
        }
      }
    }
  );
  SingleButtonGenericPlayer.prototype.getIndicator = function() { return this._indicator || this._currentPlayer; };
  SingleButtonGenericPlayer.prototype.destroy = function() { if (this._observer) { this._observer.disconnect(); } };

  window.PlayPause = window.PlayPause || {};
  window.PlayPause.SingleButtonGenericPlayer = SingleButtonGenericPlayer;
})();