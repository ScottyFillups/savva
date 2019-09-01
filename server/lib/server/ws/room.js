"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shortid = require("shortid");
class Room {
    constructor(topics, cb) {
        this.id = shortid.generate();
        this.topics = topics;
        this.index = -1;
        this.cb = cb;
    }
    start() {
        if (this.index === -1) {
            this.next();
        }
    }
    getIdentifier() {
        return this.id;
    }
    next() {
        this.index += 1;
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
