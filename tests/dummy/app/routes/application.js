import Ember from 'ember';

export default Ember.Route.extend({
  keenQuerying: Ember.inject.service(),
  actions: {
    queryGiggle: function() {
      this.get('keenQuerying').query('count', 'giggle').then(function(response) {
        console.log(response);
      });
    }
  }
});
