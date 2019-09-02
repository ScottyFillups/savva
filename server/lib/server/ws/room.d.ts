import { topic, topicState } from '../../shared/types';
declare type topicCallback = (t: topic | null, roomID: string) => void;
export declare class Room {
    private id;
    private topics;
    private index;
    private cb;
    private prevStartTime;
    constructor(topics: topic[], cb: topicCallback);
    start(): void;
    getIdentifier(): string;
    getState(): topicState | null;
    private next;
}
export {};
