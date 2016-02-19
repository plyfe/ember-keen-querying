module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackagesToProject([{ name: 'keen-js', target: '~3.4.0'}]);
  }
};
