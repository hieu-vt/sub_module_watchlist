export type Listener = { type: string; cb: (data: any) => void };
const subscribedChannel: Listener[] = [];

const subscribe = (listener: Listener, listenerContainer: Listener[]) => {
  listenerContainer.push(listener);

  return () => {
    const index = listenerContainer.findIndex(
      item => item.type === listener.type,
    );
    listenerContainer.splice(index, 1);
  };
};

export const subscribeChannel = (listener: Listener) => {
  return subscribe(listener, subscribedChannel);
};

export const unsubscribeChannel = () => {
  subscribedChannel.length = 0;
};

export const emitChannel = (actionType: string, data: any) => {
  subscribedChannel.map((item: { type: string; cb: (data: any) => void }) => {
    if (item.type === actionType) {
      item.cb(data);
    }
  });
};
