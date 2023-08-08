export type EventHandler<T extends EventInterface> = (event: T) => Promise<void>

export interface EventInterface {}

type EventClass = Function

interface ObserverHandler {
    observer: object
    handler: EventHandler<any>
}

export class EventBus {
    private observers: Set<object> = new Set()
    private handlers: Map<EventClass, ObserverHandler[]> = new Map()

    subscribe<E extends EventInterface>(observer: object, eventClass: EventClass, handler: EventHandler<E>) {
        this.observers.add(observer)
        this.createEventEntryIfMissing(eventClass)
        this.handlers.get(eventClass)!.push({ observer, handler: handler.bind(observer) })
    }

    private createEventEntryIfMissing(eventClass: EventClass) {
        if (this.handlers.has(eventClass)) return
        this.handlers.set(eventClass, new Array<ObserverHandler>())
    }

    async post(event: EventInterface) {
        for (const eventClass of this.subscribedEvents()) {
            if (!(event instanceof eventClass)) { continue }

            for (const observerHandler of this.eventObserverHandlers(eventClass)) {
                await observerHandler.handler(event)
            }
        }
    }

    private eventObserverHandlers(eventClass: EventClass) {
        return this.handlers.get(eventClass)!
    }

    private subscribedEvents() {
        return this.handlers.keys()
    }

    unsubscribe(observer: object) {
        this.observers.delete(observer)
        this.removeObserverFromAllEvents(observer)
    }

    unsubscribeAll() {
        this.observers.clear()
        this.handlers.clear()
    }

    private removeObserverFromAllEvents(observer: any) {
        for (const eventClass of this.subscribedEvents()) {
            const handlersWithoutObserver = this.eventObserverHandlers(eventClass).filter(handler => handler.observer !== observer)
            this.handlers.set(eventClass, handlersWithoutObserver)
        }
    }

    hasObserver(observer: object) {
        return this.observers.has(observer)
    }
}
