import mqtt, { MqttClient } from "mqtt";
import { create } from "zustand";

interface MqttState {
    client: MqttClient | null;
    isConnected: boolean;
    isConnecting: boolean;
    soilMoisture: number;
    temperature: number;
    plantLocation: string;
    plantName: string;
    setConnected: (status: boolean) => void;
    setSensorData: (soil: number, temp: number) => void;
    connectMqtt: () => void;
    disconnectMqtt: () => void;
}

export const useMqttStore = create<MqttState>((set, get) => ({
    client: null,
    isConnected: false,
    isConnecting: false,
    soilMoisture: 0,
    temperature: 0,
    plantLocation: "Unknown",
    plantName: "Plant #1",

    setConnected: (status) => set({ isConnected: status }),
    setSensorData: (soil, temp) => set({ soilMoisture: soil, temperature: temp }),

    connectMqtt: () => {
        const { client, isConnecting } = get();
        if(client || isConnecting) return;

        set({ isConnecting: true });

        const mqttClient = mqtt.connect("wss://mqtt-dashboard.com:8884/mqtt", {
            clientId: `client-plant-${Math.random().toString(16).substring(2, 8)}`,
            keepalive: 60,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
            clean: true,
        });

        mqttClient.on("connect", () => {
            console.log("MQTT Connected!");
            set({ isConnected: true, isConnecting: false });

            mqttClient.subscribe("r4/plant/sensor");
        });

        mqttClient.on("message", (topic, message) => {
            if (topic === "r4/plant/sensor") {
                try {
                const data = JSON.parse(message.toString());
                
                set({
                    plantName: data.plantName || "Plant #1",
                    plantLocation: data.plantLocation || "Unknown Location",
                    soilMoisture: data.soil ?? 0,
                    temperature: data.temp ?? 0,
                });
                } catch (err) {
                console.error("JSON Parse Error:", err);
                }
            }
        });

        mqttClient.on("error", (err) => {
            console.error("MQTT Error:", err);
            set({ isConnected: false, isConnecting: false });
        });

        mqttClient.on("close", () => {
            set({ isConnected: false, isConnecting: false, client: null });
        });

        set({ client: mqttClient });
    },
    
    disconnectMqtt: () => {
        const { client } = get();
        if (client) {
            client.end();
            set({ client: null, isConnected: false, isConnecting: false });
            console.log("MQTT Disconnected!");
        }
    },
}));