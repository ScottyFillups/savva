export interface topic {
  title: string;
  time: number;
}

export interface topicState {
  topic: topic;
  elapsed: number;
}

export interface baseProps {
  className?: string;
}
