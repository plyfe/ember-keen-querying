/* global Keen */
import Ember from 'ember';
import config from 'ember-get-config';

const {
  Service,
  Logger,
  RSVP,
  computed,
  typeOf,
  isBlank
  } = Ember;

/**
 *  An Ember service for Keen.io that exposes querying and extraction APIs using the keen.js library.
 *
 * See [keen-js SDK's docs](https://github.com/keen/keen-js) for more info.
 *
 * @module keen-querying
 * @namespace Service
 * @class KeenQuerying
 * @extends Ember.Service
 */
export default Service.extend({
  env: computed(function () {
    return config;
  }),

  /**
   * The Keen Project ID
   * @required
   * @property
   * @type String
   */
  projectId: computed('env', function () {
    let projectId = this.get('env').KEEN_PROJECT_ID || Ember.$('meta[property="keen:project_id"]').attr('content') || window.KEEN_PROJECT_ID;
    if (isBlank(projectId)) {
      Logger.info('Ember Keen Querying: Missing Keen project id, please set ENV.KEEN_PROJECT_ID in config.environment.js');
    }
    return projectId;
  }),


  readKey: computed('env', function () {   // String (required for sending data)
    var readKey = this.get('env').KEEN_READ_KEY || Ember.$('meta[property="keen:read_key"]').attr('content') || window.KEEN_READ_KEY;
    if (isBlank(readKey)) {
      Logger.info('Ember Keen Querying: Missing Keen read key, please set ENV.KEEN_READ_KEY in config.environment.js');
    }
    return readKey;
  }),

  /**
   * Allowed values: https | http | auto
   * @property protocol
   * @default "auto"
   * @optional
   * @type String
   */
  protocol: "auto",
  /**
   * @property host
   * @default "api.keen.io/3.0"
   * @optional
   * @type String
   */
  host: "api.keen.io/3.0",
  /**
   * Allowd values: null, jsonp, xhr, beacon
   * @property requestType
   * @default null, decided by the Keen library
   * @optional
   * @type null|String
   */
  requestType: null,

  /**
   * The Keen client object, configured and ready to go.
   * @property client
   */
  client: computed('projectId', 'readKey', 'protocol', 'host', 'requestType', function () {
    return new Keen({
      projectId: this.get('projectId'),
      readKey: this.get('readKey'),
      protocol: this.get('protocol'),
      host: this.get('host'),
      requestType: this.get('requestType')
    });
  }),

  /**
   * Query a single event collection or extraction.
   *
   * @example
   *     keenQuerying.query('count', {
   *         event_collection: "pageviews",
   *         timeframe: {
   *           "start":"2015-07-01T07:00:00.000Z",
   *           "end":"2015-08-01T07:00:00.000Z"
   *      }).then(...)
   *
   * @param analysisType
   * @param eventOrParams
   * @returns {RSVP.Promise}
   */
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

  //
  /**
   * TODO : fix these docs
   *  See [keen-js SDK's query events docs](https://github.com/keen/keen-js/blob/master/docs/query.md#run-multiple-analyses-at-once) for more info.
   *
   * argument structure = {{analysisType1: eventOrParams1}, {analysisType2: eventOrParams2}, ...}
   * @param queriesData a nested object of
   * @returns {RSVP.Promise}
     */
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

  /**
   * Inspect all event collections in the project and their properties.
   * @method
   * @returns {Ember.RSVP.Promise}
   */
  collectionsAll: function() {
    return new Ember.RSVP.Promise((resolve,reject) => {
      let url = this.get('client').url('/events');
      this.get('client').get(url, null, this.get('client').readKey(), (err, res) =>{
        if (err) {
          reject(new Error(err));
        }  else {
          resolve(res);
        }
      });
    });
  },

  /**
   * Inspect a single event collection and its properties.
   * @method
   * @param collection_name the name of the event collection to inspect
   * @returns {Ember.RSVP.Promise}
   */
  collection: function(collection_name) {
    return new Ember.RSVP.Promise((resolve,reject) => {
      let url = this.get('client').url(`/events/${collection_name}`);
      this.get('client').get(url, null, this.get('client').readKey(), (err, res) =>{
        if (err) {
          reject(new Error(err));
        }  else {
          resolve(res);
        }
      });
    });
  },

  /**
   * Creates the Keen.Query object from parameters
   * @param analysisType
   * @param eventOrParams a bare event string or collection of params.
   * @returns {Keen.Query}
   * @private
   */
  _prepareAnalysis: function (analysisType, eventOrParams) {
    var params = eventOrParams;
    if (typeOf(eventOrParams) === 'string') {
      params = {eventCollection: eventOrParams};
    }
    return new Keen.Query(analysisType, params);
  }
});

