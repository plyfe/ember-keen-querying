import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import keenClientStub from '../../helpers/stubs';
import { KeenQueryMock } from '../../helpers/stubs';
import env from 'dummy/config/environment';

moduleFor('service:keen-querying', 'Unit | Service | keen-querying', {
  setup: function() {
    env.KEEN_PROJECT_ID = "project321";
    env.KEEN_READ_KEY = "read321";
    Ember.getOwner(this).register('config:environment', env);
  }
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('project id uses ENV variable', function(assert) {
  assert.expect(1);
  var service = this.subject();
  assert.equal(service.get('projectId'), "project321");
});

test('project id defaults to global if no env variable or meta tag exists', function(assert){
  assert.expect(1);
  env.KEEN_PROJECT_ID = null;
  window.KEEN_PROJECT_ID = "123project";
  var service = this.subject();
  assert.equal(service.get('projectId'), "123project");
});

test('read key uses ENV variable', function(assert) {
  assert.expect(1);
  var service = this.subject();
  assert.equal(service.get('readKey'), "read321");
});

test('read key defaults to global if no env variable or meta tag exists', function(assert){
  assert.expect(1);
  env.KEEN_READ_KEY = null;
  window.KEEN_READ_KEY = "123read";
  var service = this.subject();
  assert.equal(service.get('readKey'), "123read");
});

/**
 * @todo change ENV variables and meta tag at runtime, and test them
 */

test('query returns a promise that resolves if success', function(assert) {
  var service = this.subject({
    client: keenClientStub.create({successMsg: "Yay"})
  });
  var promise = service.query('analysisType', 'event');
  promise.then(function(response) {
    assert.equal(response, "Yay");
  });
});

test('query returns a promise to catch if there\'s an error', function(assert) {
  var service = this.subject({
    client: keenClientStub.create({failing: true, failureMsg: "Womp"})
  });
  var promise = service.query('analysisType', 'event');
  promise.catch(function(reason) {
    assert.equal(reason, "Womp");
  });
});

test('multiQuery returns a promise that resolves if success', function(assert) {
  var service = this.subject({
    client: keenClientStub.create({successMsg: "Hoorah"})
  });
  var promise = service.query('analysisType', 'event');
  promise.then(function(response) {
    assert.equal(response, "Hoorah");
  });
});

test('multiQuery returns a promise to catch if there\'s an error', function(assert) {
  var service = this.subject({
    client: keenClientStub.create({failing: true, failureMsg: "Boo"})
  });
  var promise = service.query('analysisType', 'event');
  promise.catch(function(reason) {
    assert.equal(reason, "Boo");
  });
});

test('_prepareAnalysis returns a new Keen.Query', function(assert) {
  window.Keen.Query = KeenQueryMock;
  var service = this.subject();
  var keenQuery = service._prepareAnalysis("count", {});
  assert.equal(keenQuery.constructor.name, "KeenQueryMock");
});

test('_prepareAnalysis accepts either an object or a string for its second argument', function(assert) {
  window.Keen.Query = KeenQueryMock;
  var service = this.subject();
  var keenQuery1 = service._prepareAnalysis("sum", {eventCollection: "wiggles"});
  var keenQuery2 = service._prepareAnalysis("sum", "wiggles");
  assert.equal(keenQuery1.params.eventCollection, "wiggles", "params accepts object as is");
  assert.equal(keenQuery2.params.eventCollection, "wiggles", "params adds string as eventCollection property");
});


test('inspect all event collections', function(assert) {
  let event = [
      {
        "name": "purchases",
        "properties": {
          "item.id": "num",
          "item.on_sale": "bool",
          "item.price": "num",
          "quantity": "num",
          "screen.name": "string",
          "user.id": "num",
          "user.level": "num",
          "user.referring_source": "string"
        },
        "url": "/3.0/projects/PROJECT_ID/events/purchases"
      },
      {
        "name": "level_ups",
        "properties": {
          "from_level": "num",
          "level": "num",
          "screen.name": "string",
          "to_level": "num",
          "user.id": "num",
          "user.level": "num",
          "user.prior_balance": "num",
          "user.referring_source": "string"
        },
        "url": "/3.0/projects/PROJECT_ID/events/level_ups"
      },
      {
        "name": "logins",
        "properties": {
          "user.email": "string",
          "user.id": "string",
          "user_agent.browser": "string",
          "user_agent.browser_version": "string",
          "user_agent.platform": "string"
        },
        "url": "/3.0/projects/PROJECT_ID/events/logins"
      }
    ];
  var service = this.subject({
    client: keenClientStub.create({getResponse: event})
  });
  return service.collectionsAll().then((r) => {
    assert.deepEqual(r, event);
  });
});


test('inspect single event', function(assert) {

  let event =  {
    "name": "purchases",
    "properties": {
      "item.id": "num",
      "item.on_sale": "bool",
      "item.price": "num",
      "quantity": "num",
      "screen.name": "string",
      "user.id": "num",
      "user.level": "num",
      "user.referring_source": "string"
    },
    "url": "/3.0/projects/PROJECT_ID/events/COLLECTION_NAME"
  };
  var service = this.subject({
    client: keenClientStub.create({getResponse: event})
  });
  return service.collection().then((r) => {
    assert.deepEqual(r, event);
  });
});

