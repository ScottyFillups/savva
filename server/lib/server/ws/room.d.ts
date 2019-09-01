import { topic } from '../../shared/types';
declare type topicCallback = (t: topic | null, roomID: string) => void;
export declare class Room {
    private id;
    private topics;
    private index;
    private cb;
    constructor(topics: topic[], cb: topicCallback);
    start(): void;
    getIdentifier(): string;
    private next;
}
export {};
