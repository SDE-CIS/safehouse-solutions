import { useState, useEffect } from "react";
import mqtt from "mqtt";
import { Feed } from "@/types/mqtt.ts";
import { set } from "zod";

interface UseMqttOptions {
    server: string;
    port: number;
    username: string;
    password: string;
    clientId: string;
    topic: string;
}

interface UseMqttResult {
    message: string | null;
    isConnected: boolean;
    reconnecting: boolean;
}

export function useMqtt({
    server,
    port,
    username,
    password,
    clientId,
    topic,
}: UseMqttOptions): UseMqttResult {
    const [message, setMessage] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [reconnecting, setReconnecting] = useState(false);

    useEffect(() => {
        const uniqueClientId = `${clientId}-${Math.random().toString(16).substring(2, 8)}`;
        const client = mqtt.connect(`ws://${server}:${port}/mqtt`, {
            username,
            password,
            clientId: uniqueClientId,
            keepalive: 60,
            reconnectPeriod: 1000,
        });

        client.on("connect", () => {
            console.log("Connected to MQTT broker");
            setIsConnected(true);
            setReconnecting(false);

            // Subscribe to the given topic
            client.subscribe(topic, (err) => {
                if (err) {
                    console.error("Failed to subscribe to topic", err);
                } else {
                    console.log(`Subscribed to topic: ${topic}`);
                }
            });
        });

        client.on("reconnect", () => {
            console.log("Reconnecting to MQTT broker...");
            setReconnecting(true);
        });

        client.on("close", () => {
            console.log("Disconnected from MQTT broker");
            setIsConnected(false);
        });

        client.on("offline", () => {
            console.log("Client offline");
            setIsConnected(false);
        });

        client.on("message", (receivedTopic, payload) => {
            if (receivedTopic === topic) {
                try {
                    const messageText = payload.toString();
                    setMessage(messageText);
                } catch (error) {
                    console.error("Failed to handle MQTT message:", error);
                }
            }
        });

        client.on("error", (err) => console.error("MQTT error:", err));

        return () => {
            client.end(); // Clean up the connection
        };
    }, [server, port, username, password, clientId, topic]);

    return { message, isConnected, reconnecting };
}
