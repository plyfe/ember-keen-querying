import Ember from 'ember';

let { get } = Ember;

export default Ember.Object.extend({
  failing: false,
  successMsg: "Success",
  failureMsg: "Failure",
  run: function(analysis, callback) {
    if(get(this, 'failing')) {
      callback.call(this, get(this, 'failureMsg'), get(this, 'successMsg'));
    } else {
      callback.call(this, null, get(this, 'successMsg'));
    }
  },
  readKey: function() {
    return "TEST_READ";
  },
  url: function(path) {
    return `http://keen-querying${path}`;
  },
  get: function(url, params, api_key, callback) {
    if(/events\/.+/.test(url)) {
      callback.call(this, false,  get(this, 'getResponse'));

    } else if( /\/events$/.test(url)) {
      callback.call(this, false, get(this, 'getResponse'));
    } else {
      callback.call(this, {message: "invalid url"}, null);
    }
  }
});

export function KeenQueryMock(analysisType, params){
  this.analysisType = analysisType;
  this.params = params;
}
