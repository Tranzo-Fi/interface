import { toast } from "react-toastify";

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
