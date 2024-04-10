[![npm](https://img.shields.io/npm/v/@nbottarini/eventbus.svg)](https://www.npmjs.com/package/@nbottarini/eventbus)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI Status](https://github.com/nbottarini/eventbus-js/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/nbottarini/eventbus-js/actions)

# EventBus
Simple Typescript and Javascript event bus

## Installation

Npm:
```
$ npm install --save @nbottarini/eventbus
```

Yarn:
```
$ yarn add @nbottarini/eventbus
```

## Usage

```typescript
class Producer {
    constructor(private eventBus: EventBus) {}

    async doSomething() {
        await eventBus.post(new SampleEvent())
    }
}

class Consumer {
    constructor(private eventBus: EventBus) {
        this.eventBus.subscribe(this, SampleEvent, this.onSampleEvent)        
    }

    onSampleEvent(event: SampleEvent) {
        // Do Something
    }
}

class SampleEvent extends EventInterface {
}

```
