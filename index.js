/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-keen-querying',

  included: function(app) {
    this._super.included(app);
    app.import(app.bowerDirectory + '/keen-min-js/keen-min.js');
  }
};
