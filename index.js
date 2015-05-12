/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-keen-querying',

  contentFor: function(type) {
    if(type === 'head') {
      return '<script src="//cdn.jsdelivr.net/keen.js/3.2.3/keen.min.js" type="text/javascript"></script>';
    }
  }
};
