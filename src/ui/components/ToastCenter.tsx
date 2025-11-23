import { NotificationItem } from '../../engine/types';

interface Props {
  notifications: NotificationItem[];
}

export default function ToastCenter({ notifications }: Props) {
  return (
    <div className="toast-container">
      {notifications.map((n) => (
        <div key={n.id} className="toast">
          <div style={{ fontWeight: 700 }}>{n.title}</div>
          <div style={{ color: '#cbd5e1' }}>{n.body}</div>
        </div>
      ))}
    </div>
  );
}
