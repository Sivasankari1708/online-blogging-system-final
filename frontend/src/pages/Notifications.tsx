import { useEffect, useState } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Bell, Heart, MessageSquare, UserPlus, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  senderName?: string;
  senderImage?: string;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/notifications/${userId}`);
        setNotifications(response.data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'like': return <Heart className="h-5 w-5 text-red-500" />;
      case 'comment': return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'follow': return <UserPlus className="h-5 w-5 text-accent" />;
      default: return <Bell className="h-5 w-5 text-text-muted" />;
    }
  };

  // Grouping logic
  const grouped = notifications.reduce((acc, notif) => {
    const date = new Date(notif.createdAt);
    if (isToday(date)) acc.today.push(notif);
    else if (isYesterday(date)) acc.yesterday.push(notif);
    else acc.older.push(notif);
    return acc;
  }, { today: [] as Notification[], yesterday: [] as Notification[], older: [] as Notification[] });

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 flex justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderGroup = (title: string, items: Notification[]) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-8 animate-fade-in">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4 px-2">{title}</h3>
        <div className="space-y-3">
          {items.map(notif => (
            <div 
              key={notif.id} 
              className={`card p-4 flex gap-4 transition-all duration-300 ${!notif.read ? 'bg-primary/5 border-primary/30' : 'bg-surface'}`}
              onClick={() => !notif.read && markAsRead(notif.id)}
            >
              <div className="mt-1">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${!notif.read ? 'text-white font-medium' : 'text-text-muted'}`}>
                  {notif.message}
                </p>
                <div className="text-xs text-text-muted mt-2">
                  {format(new Date(notif.createdAt), 'MMM d, yyyy • h:mm a')}
                </div>
              </div>
              {!notif.read && (
                <div className="flex flex-col items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary mb-2"></div>
                  <button className="btn-ghost p-1" title="Mark as read">
                    <CheckCircle2 className="h-4 w-4 text-text-muted hover:text-green-500" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Bell className="h-8 w-8 text-primary" /> Notifications
        </h1>
        <button className="btn-secondary text-sm">
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 card border-dashed">
          <Bell className="h-12 w-12 text-border mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">You're all caught up!</h3>
          <p className="text-text-muted">No new notifications at the moment.</p>
        </div>
      ) : (
        <>
          {renderGroup('Today', grouped.today)}
          {renderGroup('Yesterday', grouped.yesterday)}
          {renderGroup('Older', grouped.older)}
        </>
      )}
    </div>
  );
}
