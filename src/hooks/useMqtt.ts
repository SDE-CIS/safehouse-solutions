import { useState, useEffect, useRef } from "react";
import mqtt, { MqttClient } from "mqtt";
import { Feed } from "@/types/mqtt.ts";

interface UseMqttOptions {
    server: string;
    port: number;
    username: string;
    password: string;
    clientId: string;
    topic: string;
}

interface UseMqttResult {
    message: Feed | string | null;
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
    const [message, setMessage] = useState<Feed | string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [reconnecting, setReconnecting] = useState(false);
    const clientRef = useRef<MqttClient | null>(null);

    useEffect(() => {
        // ✅ Prevent multiple clients on re-render
        if (clientRef.current) return;

        const uniqueClientId = `${clientId}-${Math.random().toString(16).substring(2, 8)}`;
        const client = mqtt.connect(`ws://${server}:${port}`, {
            username,
            password,
            clientId: uniqueClientId,
            keepalive: 60,
            reconnectPeriod: 2000,
            clean: true,
        });

        clientRef.current = client;

        client.on("connect", () => {
            console.log("[MQTT] Connected");
            setIsConnected(true);
            setReconnecting(false);

            client.subscribe(topic, (err) => {
                if (err) console.error("[MQTT] Failed to subscribe:", err);
                else console.log(`[MQTT] Subscribed to topic: ${topic}`);
            });
        });

        client.on("reconnect", () => {
            console.log("[MQTT] Reconnecting...");
            setReconnecting(true);
        });

        client.on("close", () => {
            console.log("[MQTT] Connection closed");
            setIsConnected(false);
        });

        client.on("offline", () => {
            console.log("[MQTT] Offline");
            setIsConnected(false);
        });

        client.on("message", (receivedTopic, payload) => {
            if (receivedTopic !== topic) return;

            const raw = payload.toString();
            let parsed: Feed | string = raw;
            try {
                parsed = JSON.parse(raw);
            } catch { }

            // ✅ Always trigger a new state change, even if identical
            setMessage({ data: parsed, _ts: Date.now() } as unknown as Feed);
        });

        client.on("error", (err) => console.error("[MQTT] Error:", err));

        return () => {
            console.log("[MQTT] Cleaning up client...");
            client.end(true);
            clientRef.current = null;
        };
    }, [server, port, username, password, clientId, topic]);

    return { message, isConnected, reconnecting };
}
