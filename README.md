[![Build Status](https://travis-ci.org/plyfe/ember-keen-querying.svg?branch=master)](https://travis-ci.org/plyfe/ember-keen-querying) [![Ember Observer Score](http://emberobserver.com/badges/ember-keen-querying.svg)](http://emberobserver.com/addons/ember-keen-querying)

# Ember Keen Querying

An easy way to query Keen.io data from your Ember CLI App.

---

ember-keen-querying is addon that provides an Ember service wrapping the [keen-js SDK](https://github.com/keen/keen-js). Since it is a service, it can injected and used anywhere in your application.

It exposes querying and analysis APIs to run simple and advanced queries using the keen.js API.

**Want to Track Events?**
To track Keen.io events in Ember, see the sister addon: [ember-keen-tracking](https://github.com/plyfe/ember-keen-tracking)


## Installation

```sh
ember install ember-keen-querying    # install:addon for Ember CLI < 0.2.3
ember generate ember-keen-querying
```

##  Updating

This project is new and the API is subject to change. When updating your project to a newer version of ember-keen-querying, please consult the [changelog](CHANGELOG.md) for any update notes.

## Getting Started

A Keen project id and read key is required to query events. You can set these api keys in one of 3 ways:

1. Set a `KEEN_PROJECT_ID` and `KEEN_READ_KEY` on `ENV` in `config/environment`. The [ember-cli-dotenv](https://github.com/fivetanley/ember-cli-dotenv) addon is a safe and easy way to do this.

2. A meta tag of the form: `<meta property="keen:project_id" content="[KEEN_PROJECT_ID]" />`

3. Set a global `KEEN_PROJECT_ID`

## Basic Usage
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
