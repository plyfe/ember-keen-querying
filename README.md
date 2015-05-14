[![Build Status](https://travis-ci.org/plyfe/ember-keen-querying.svg?branch=master)](https://travis-ci.org/plyfe/ember-keen-querying) [![Ember Observer Score](http://emberobserver.com/badges/ember-keen-querying.svg)](http://emberobserver.com/addons/ember-keen-querying)

# ember-keen-querying

ember-keen-querying is an easy way to query events in Keen IO in your ember-cli project. A simple Ember service wraps the [keen-js SDK](https://github.com/keen/keen-js) and can be injected anywhere in your application.

To track Keen IO events in ember, see the sister addon: [ember-keen-tracking](https://github.com/plyfe/ember-keen-tracking)

We welcome contributions!

## Installation

`ember install:addon ember-keen-querying`<br>
`ember generate ember-keen-querying`

## Setup

A Keen project id and read key is required to track events. You can set these api keys in one of 3 ways:

1. Set a `KEEN_PROJECT_ID` and `KEEN_READ_KEY` on `ENV` in `config/environment`. The [ember-cli-dotenv](https://github.com/fivetanley/ember-cli-dotenv) addon is a safe and easy way to do this.

2. A metatag of the form: `<meta property="keen:project_id" content="[KEEN_PROJECT_ID]" />`

3. Set a global `KEEN_PROJECT_ID`.

## Usage

*The Ember.Service class is only supported in Ember 1.11+. If your application is on an older version of Ember, you can achieve the same effect of this addon by injecting the service as an Ember object through an initializer.*

You can inject and use the service anywhere like so:

```
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
```

You can query multiple events at once with `multiQuery`. See the dummy app for more info.
