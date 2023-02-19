export type Listener = (data: any) => void;
import { onCheckType } from '../common/index';
let subscribedChannel = new Map<string, Listener>();

const subscribe = (listener: Listener, key: string) => {
  subscribedChannel.set(key, listener);

  return () => {
    subscribedChannel.delete(key);
  };
};

export const subscribeChannel = (listener: Listener, key: string) => {
  return subscribe(listener, key);
};

export const unsubscribeChannel = () => {
  subscribedChannel = new Map<string, Listener>();
};

export const emitChannel = (key: string, data?: any) => {
  const callback = subscribedChannel.get(key);
  if (onCheckType(callback, 'function')) {
    callback(data);
  }
};
