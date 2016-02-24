/* global Keen */
import Ember from 'ember';
import config from 'ember-get-config';

const {
  Service,
  Logger,
  RSVP,
  computed,
  typeOf
  } = Ember;

// See keen-js SDK's query events docs for more info:
// https://github.com/keen/keen-js/blob/master/docs/query.md#run-multiple-analyses-at-once

export default Service.extend({
  env: computed(function () {
    return config;
  }),

  projectId: computed('env', function () {   // String (required always)
    var projectId = this.get('env').KEEN_PROJECT_ID || Ember.$('meta[property="keen:project_id"]').attr('content') || window.KEEN_PROJECT_ID;
    if (!projectId) {
      Logger.info('Ember Keen Querying: Missing Keen project id, please set `ENV.KEEN_PROJECT_ID` in config.environment.js');
    }
    return projectId;
  }),


  readKey: computed('env', function () {   // String (required for sending data)
    var readKey = this.get('env').KEEN_READ_KEY || Ember.$('meta[property="keen:read_key"]').attr('content') || window.KEEN_READ_KEY;
    if (!readKey) {
      Logger.info('Ember Keen Querying: Missing Keen read key, please set `ENV.KEEN_READ_KEY` in config.environment.js');
    }
    return readKey;
  }),

  protocol: "auto",         // String (optional: https | http | auto)
  host: "api.keen.io/3.0",  // String (optional)
  requestType: null,        // String (optional: jsonp, xhr, beacon)

  client: computed('projectId', 'readKey', 'protocol', 'host', 'requestType', function () {
    return new Keen({
      projectId: this.get('projectId'),
      readKey: this.get('readKey'),
      protocol: this.get('protocol'),
      host: this.get('host'),
      requestType: this.get('requestType')
    });
  }),

  query: function (analysisType, eventOrParams) {
    var analysis = this._prepareAnalysis(analysisType, eventOrParams);
    return new RSVP.Promise((resolve, reject) => {
      this.get('client').run(analysis, (err, res) => {
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
  multiQuery: function (queriesData) {
    var analyses = [];
    for (var key in queriesData) {
      var newAnalysis = this._prepareAnalysis(key, queriesData[key]);
      analyses.push(newAnalysis);
    }
    return new RSVP.Promise((resolve, reject) => {
      this.get('client').run(analyses, (err, res) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(res);
        }
      });
    });
  },

  _prepareAnalysis: function (analysisType, eventOrParams) {
    var params = eventOrParams;
    if (typeOf(eventOrParams) === 'string') {
      params = {eventCollection: eventOrParams};
    }
    return new Keen.Query(analysisType, params);
  }
});
