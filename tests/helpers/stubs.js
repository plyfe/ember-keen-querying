import Ember from 'ember';

export default Ember.Object.extend({
  failing: false,
  successMsg: "Success",
  failureMsg: "Failure",
  run: function(analysis, callback) {
    if(this.get('failing')) {
      callback.call(this, this.get('failureMsg'), this.get('successMsg'));
    } else {
      callback.call(this, null, this.get('successMsg'));
    }
  }
});

export function KeenQueryMock(analysisType, params){
  this.analysisType = analysisType;
  this.params = params;
}
