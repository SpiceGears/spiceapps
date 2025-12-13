import { useEffect, useState } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { toast } from "sonner";
import { getCookie } from "typescript-cookie";
import { getBackendUrl } from "@/app/serveractions/backend-url";

interface NewRegistrationNotification {
  id: string;
  userId: string;
  sourceApp: string;
  username: string;
  email: string;
  requestedAt: string;
}

export function useRegistrationNotifications(enabled: boolean = true) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [notifications, setNotifications] = useState<
    NewRegistrationNotification[]
  >([]);

  useEffect(() => {
    if (!enabled) return;

    const setupConnection = async () => {
      const backendUrl = await getBackendUrl();
      const token = getCookie("accessToken");

      if (!backendUrl || !token) {
        console.error("Backend URL or token not found");
        return;
      }

      const newConnection = new HubConnectionBuilder()
        .withUrl(`${backendUrl}/realtime/notifications?token=${token}`)
        .withAutomaticReconnect()
        .build();

      setConnection(newConnection);
    };

    setupConnection();
  }, [enabled]);

  useEffect(() => {
    if (!connection) return;

    connection
      .start()
      .then(() => {
        console.log("Connected to SignalR notifications hub");

        // Nasłuchuj nowych zgłoszeń rejestracyjnych
        connection.on(
          "NewRegistrationRequest",
          (notification: NewRegistrationNotification) => {
            console.log("New registration request:", notification);

            setNotifications((prev) => [...prev, notification]);

            // Wyświetl toast notification
            toast.info(`New registration from ${notification.sourceApp}`, {
              description: `User: ${notification.username} (${notification.email})`,
              action: {
                label: "View",
                onClick: () => {
                  window.location.href = "/admin";
                },
              },
            });
          }
        );

        // Nasłuchuj zatwierdzeń
        connection.on("RegistrationApproved", (data: any) => {
          console.log("Registration approved:", data);
          toast.success(
            `Registration approved for user from ${data.sourceApp}`
          );
        });

        // Nasłuchuj odrzuceń
        connection.on("RegistrationRejected", (data: any) => {
          console.log("Registration rejected:", data);
          toast.error(`Registration rejected for user from ${data.sourceApp}`);
        });
      })
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [connection]);

  return {
    notifications,
    clearNotifications: () => setNotifications([]),
  };
}

// Hook do użycia w layout.tsx lub głównym komponencie admina
export function useAdminNotifications() {
  const { notifications } = useRegistrationNotifications(true);

  return {
    pendingRequestsCount: notifications.length,
  };
}
