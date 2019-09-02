"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shortid = require("shortid");
class Room {
    constructor(topics, cb) {
        this.id = shortid.generate();
        this.topics = topics;
        this.index = -1;
        this.cb = cb;
        this.prevStartTime = null;
    }
    start() {
        if (this.index === -1) {
            this.next();
        }
    }
    getIdentifier() {
        return this.id;
    }
    getState() {
        if (this.index === -1 || !this.prevStartTime) {
            return { started: false };
        }
        const now = new Date();
        const secondDiff = (now.getTime() - this.prevStartTime.getTime()) / 1000;
        return {
            topic: this.topics[this.index],
            elapsed: secondDiff,
            started: true
        };
    }
    next() {
        this.index += 1;
        this.prevStartTime = new Date();
        const newTopic = this.topics.length <= this.index ? null : this.topics[this.index];
        this.cb(newTopic, this.id);
        if (newTopic !== null) {
            setTimeout(() => {
                this.next();
            }, newTopic.time * 1000);
        }
    }
}
exports.Room = Room;
