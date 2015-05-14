
'use strict';

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackagesToProject([{ name: 'keen-min-js', target: '3.2.3'}]);
  }
};
