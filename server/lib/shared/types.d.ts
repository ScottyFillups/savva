export interface topic {
    title: string;
    time: number;
}
export interface topicState {
    started: boolean;
    topic?: topic;
    elapsed?: number;
}
export interface baseProps {
    className?: string;
}
