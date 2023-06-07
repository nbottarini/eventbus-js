import { EventBus, EventInterface } from '../src'

it('notify an observer of an event when it\'s posted', async () => {
    eventBus.subscribe(observer, SampleEvent, handler)
    const event = new SampleEvent()

    await eventBus.post(event)

    expect(handler.mock.calls.length).toEqual(1)
    expect(handler.mock.calls[0][0]).toEqual(event)
})

it('notify a observer if is subscribed to a parent event', async () => {
    eventBus.subscribe(observer, ParentEvent, handler)
    const event = new SampleEvent()

    await eventBus.post(event)

    expect(handler.mock.calls.length).toEqual(1)
    expect(handler.mock.calls[0][0]).toEqual(event)
})

it('not notify an observer if it has been unsubscribed', async () => {
    eventBus.subscribe(observer, SampleEvent, handler)
    eventBus.unsubscribe(observer)

    await eventBus.post(new SampleEvent())

    expect(handler.mock.calls.length).toEqual(0)
})

it('allow observers to subscribe to multiple events at once', async () => {
    const handler2 = jest.fn()
    eventBus.subscribe(observer, SampleEvent, handler)
    eventBus.subscribe(observer, OtherEvent, handler2)
    const event1 = new SampleEvent()
    const event2 = new OtherEvent()

    await eventBus.post(event1)
    await eventBus.post(event2)

    expect(handler.mock.calls.length).toEqual(1)
    expect(handler.mock.calls[0][0]).toEqual(event1)
    expect(handler2.mock.calls.length).toEqual(1)
    expect(handler2.mock.calls[0][0]).toEqual(event2)
})

it('hasObserver returns true if observer is subscribed', async () => {
    eventBus.subscribe(observer, SampleEvent, handler)

    expect(eventBus.hasObserver(observer)).toBeTruthy()
})

it('hasObserver returns false if observer has unsubscribed', async () => {
    eventBus.subscribe(observer, SampleEvent, handler)
    eventBus.unsubscribe(observer)

    expect(eventBus.hasObserver(observer)).toBeFalsy()
})

beforeEach(() => {
    eventBus = new EventBus()
    observer = {}
    handler = jest.fn()
})

let eventBus: EventBus
let observer: any
let handler: jest.Mock

abstract class ParentEvent implements EventInterface {}

class SampleEvent extends ParentEvent {}

class OtherEvent implements EventInterface {}
