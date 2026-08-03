import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
} from "../../hooks/useNotifications";
import { Bell } from "lucide-react";

const typeIcons = {
  streak: "🔥",
  roadmap: "🗺️",
  career: "💼",
  system: "🔔",
};

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { data: notifData } = useNotifications();
  const { data: countData } = useUnreadCount();

  const markReadMutation = useMarkAsRead();
  const markAllReadMutation = useMarkAllAsRead();

  const unreadCount = countData?.data?.count || 0;
  const notifications = notifData?.data?.notifications || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification._id);
    }

    setIsOpen(false);

    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Bell
          size={20}
          className="text-gray-700 dark:text-gray-300"
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 z-50">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>

            {unreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                Mark all
              </button>
            )}
          </div>

          {/* Empty State */}
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
              No notifications yet.
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <button
                  key={notification._id}
                  onClick={() =>
                    handleNotificationClick(notification)
                  }
                  className={`flex w-full gap-3 border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 ${
                    !notification.isRead
                      ? "bg-indigo-50 dark:bg-indigo-950/30"
                      : ""
                  }`}
                >
                  <div className="text-xl">
                    {typeIcons[notification.type] || "🔔"}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {notification.message}
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <div className="mt-2 h-2 w-2 rounded-full bg-indigo-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;