import type { IEventData } from '@pixi-v8-patch-spine/base';

/**
 * @public
 */
export class EventData implements IEventData {
    name: string;
    intValue: number;
    floatValue: number;
    stringValue: string;
    audioPath: string;
    volume: number;
    balance: number;

    constructor(name: string) {
        this.name = name;
    }
}
