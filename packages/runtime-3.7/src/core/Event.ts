import type { EventData } from './EventData';
import type { IEvent } from '@pixi-v8-patch-spine/base';

/**
 * @public
 */
export class Event implements IEvent {
    data: EventData;
    intValue: number;
    floatValue: number;
    stringValue: string;
    time: number;
    volume: number;
    balance: number;

    constructor(time: number, data: EventData) {
        if (data == null) throw new Error('data cannot be null.');
        this.time = time;
        this.data = data;
    }
}
