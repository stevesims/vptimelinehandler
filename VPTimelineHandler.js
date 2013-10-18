/*
  VPTimelineHandler
  A simple action timeline handling module

  (c) 2011-13, Steve Sims and Vert Pixels Ltd.
  All Rights Reserved

  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

  1) Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
  2) Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var VPTimelineHandler = function() {
  "use strict";

  var kTimeReg = /(\d+):(\d+.*\d*)/;
  if (Object.freeze) {
    Object.freeze(kTimeReg);
  }
  
  // use regular VPUtils module if it's there, or make a light-weight one for internal use
  var VPUtils = window.VPUtils || {
    isString: function isString(object) {
      return typeof object === 'string' || object instanceof String;
    }
  };
  
  function debug() {
    if (window.DEBUG !== undefined && window.DEBUG && window.console && window.console.log) {
      var args = Array.prototype.slice.call(arguments);
      if (window.SHOW_TRACE && window.console && window.console.trace) {
        console.trace();
      }
      if (window.TIMESTAMP) {
        args[0] = "DEBUG @ " + Date.now() + ": " + args[0];
      } else {
        args[0] = "DEBUG: " + args[0];
      }
      if (console.log.apply) {
        console.log.apply(console, args);
      } else {
        // fallback for some versions of IE
        console.log(args[0], args[1] || '', args[2] || '', args[3] || '', args[4] || '', args[5] || '', args[6] || '', args[7] || '');
      }
    }
  };
  
  // engine object creator function definition
  var engine = function VPTimelineHandler(params) {
    if (window && this === window) {
      throw new TypeError("not calling as constructor");
    }
    
    // copy stuff from params object into 'this'
    for (var param in params) {
      if (params.hasOwnProperty(param)) {
        if (this[param]) {
          debug("Ignoring param key %o since it already exists in timeline handler", param);
        } else {
          this[param] = params[param];
        }
      }
    }
  };
  
  engine.prototype.reset = function() {
    this.applyActions(this.globalInitActions);
    this.applyActions(this.initActions);
    this.lastTimeCheck = -0.1;
  };
  
  engine.prototype.checkTime = function(newTime) {
    var timeline = this.timeline || [];
    
    newTime = newTime || 0;
    
    if (newTime < (this.lastTimeCheck - 0.1)) {
      this.reset();
    }
    
    var i;
    for (i = 0; i < timeline.length; i++) {
      var tl = timeline[i];
      var at = this.getAt(tl);
      if (at <= newTime) {
        if (at > this.lastTimeCheck) {
          this.currentTime = at;
          this.applyActions(this.checkActions, this);
          this.applyActions(tl.actions);
        }
      } else {
        break;
      }
    }
    
    this.lastTimeCheck = newTime;
  };
  
  engine.prototype.getAt = function(tl) {
    var time = tl.time;
    if (time != undefined) return time;
    var at = tl.at;
    if (VPUtils.isString(at)) {
      time = at.match(kTimeReg);
      if (!time) {
        debug("invalid time string %o - ignoring", at);
        return 0;
      }
      at = new Number(time[1]);
      at = (at * 60) + (new Number(time[2]));
    }
    tl.time = at;
    return at;
  };
  
  engine.prototype.applyActions = function applyActions(actions, target) {
    actions = actions || [];
    target = target || this.target || this;
    actions.forEach(function(action) {
      if (Array.isArray(action)) {
        this.applyActions(action, target);
      } else {
        try {
          var actionTarget;
          if (action.target) {
            actionTarget = this[action.target];
          } else {
            actionTarget = target;
          }
          if (!actionTarget) {
            debug("Error: target (%o) not found when applying action %o", action.target, action);
          } else {
            actionTarget[action.action].apply(actionTarget, action.arguments);
          }
        } catch(e) {
          debug("Caught error %o when applying action %o", e, action);
        }
      }
    }, target);
  };
  
  engine.prototype.setTargetValue = function setTargetValue(key, value) {
    if (!this.target) {
      debug("no target set, so cannot setTargetValue");
      return;
    }
    var newValue = value;
    if (VPUtils.isString(value)) {
      newValue = this[value];
      if (!newValue) {
        debug("warning: value %o not found in 'this' - setting target value as string");
        newValue = value;
      }
    }
    this.target[key] = newValue;
  };
  
  return engine;
}();
