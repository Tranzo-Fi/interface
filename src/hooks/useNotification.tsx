import { useCallback } from "react";
import { toast } from "react-toastify";

const defaultConfig = {
  position: "bottom",
  duration: 3000,
  isClosable: true,
};

export type NotificationPayloadType = {
  title: string | JSX.Element;
  description: string | JSX.Element;
};

export function useNotification() {
  const notify = (payload: NotificationPayloadType) => {
    toast(
      <div>
        <p>{payload.title}</p>
        <p>{payload.description}</p>
      </div>,
      {
        type: "default",
      }
    );
  };

  return {
    notify,
  };
}
