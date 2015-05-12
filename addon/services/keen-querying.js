/* global Keen */

// See keen-js SDK's query events docs for more info:
// https://github.com/keen/keen-js/blob/master/docs/query.md#run-multiple-analyses-at-once

import Ember from 'ember';

export default Ember.Service.extend({
  env: function() {
    return this.container.lookupFactory('config:environment');
  }.property(),
  projectId: function() {   // String (required always)
    var projectId = this.get('env').KEEN_PROJECT_ID || Ember.$('meta[property="keen:project_id"]').attr('content') || window.KEEN_PROJECT_ID;
    if (!projectId) {
      Ember.Logger.info('Ember Keen Querying: Missing Keen project id, please set `ENV.KEEN_PROJECT_ID` in config.environment.js');
    }
    return projectId;
  }.property('env'),
  readKey: function() {     // String (required for sending data)
    var readKey = this.get('env').KEEN_READ_KEY || Ember.$('meta[property="keen:read_key"]').attr('content') || window.KEEN_READ_KEY;
    if (!readKey) {
      Ember.Logger.info('Ember Keen Querying: Missing Keen read key, please set `ENV.KEEN_READ_KEY` in config.environment.js');
    }
    return readKey;
  }.property('env'),
  protocol: "auto",         // String (optional: https | http | auto)
  host: "api.keen.io/3.0",  // String (optional)
  requestType: null,        // String (optional: jsonp, xhr, beacon)

  client: function() {
    return new Keen({
      projectId: this.get('projectId'),
      readKey: this.get('readKey'),
      protocol: this.get('protocol'),
      host: this.get('host'),
      requestType: this.get('requestType')
    });
  }.property('projectId', 'readKey', 'protocol', 'host', 'requestType'),

  query: function(analysisType, eventOrParams) {
    var self = this;
    var analysis = this._prepareAnalysis(analysisType, eventOrParams);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      self.get('client').run(analysis, function(err, res){
        if (err) {
          reject(err);
        }
        else {
          resolve(res);
        }
      });
    });
  },

  // argument structure = {{analysisType1: eventOrParams1}, {analysisType2: eventOrParams2}, ...}
  // https://github.com/keen/keen-js/blob/master/docs/query.md#run-multiple-analyses-at-once
  multiQuery: function(queriesData) {
    var self = this;
    var analyses = [];
    for (var key in queriesData) {
      var newAnalysis = this._prepareAnalysis(key, queriesData[key]);
      analyses.push(newAnalysis);
    }
    return new Ember.RSVP.Promise(function(resolve,reject) {
      self.get('client').run(analyses, function(err, res) {
        if (err) {
          reject(err);
        }
        else {
          resolve(res);
        }
      });
    });
  },

  _prepareAnalysis: function(analysisType, eventOrParams) {
    var params = eventOrParams;
    if (Ember.typeOf(eventOrParams) === 'string') {
      params = { eventCollection: eventOrParams };
    }
    return new Keen.Query(analysisType, params);
  }
});
