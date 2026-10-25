"use client"

import { faBell, faCheck, faDroplet, faRotateLeft, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useMqttStore } from "../zustand/mqttState";

interface WaterAlert {
  id: string;
  plantName: string;
  location: string;
  moisture: number;
}

export default function WaterAlertList() {
    const { isConnected, soilMoisture, plantName, plantLocation } = useMqttStore();
    const [alerts, setAlerts] = useState<WaterAlert[]>([]);

    useEffect(() => {
      if (!isConnected) return;

      const DRY_THRESHOLD = 33;

      if (soilMoisture < DRY_THRESHOLD) {
        if(alerts.length == 0){
          setAlerts([
            {
                id: "plant-1",
                plantName: plantName || "ต้นกะเพรา",
                location: plantLocation || "ที่บ้าน ชั้น 3",
                moisture: soilMoisture,
              }
          ]);
        }
      }
    }, [soilMoisture, isConnected, plantName, plantLocation, alerts]);

  const handleWaterSingle = (id: string) => {
    setAlerts((prev) => prev.filter((item) => item.id !== id));
  };

return (
    <div className={`flex-1 ${ isConnected ? 'flex' : 'hidden' } flex-col bg-white border border-gray-200 rounded-2xl p-3 md:p-5 shadow-sm`}>
      {/* Title */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="p-4 rounded-xl bg-yellow-500 flex items-center justify-center text-yellow-800">
            <FontAwesomeIcon icon={faBell} className="w-3! md:w-4! xl:w-5! h-3! md:h-4! xl:h-5!" />
          </div>
          <div>
            <h1 className="font-bold text-chocolate text-base md:text-lg xl:text-xl">Watering Alert List</h1>
            <span className="text-xs md:text-sm xl:text-base text-gray-400">ระบบแจ้งเตือนการรดน้ำ</span>
          </div>
        </div>

        <span className="text-xs md:text-sm xl:text-base bg-warm-yellow text-chocolate font-bold px-3 py-1 rounded-full">{alerts.length} ต้น</span>
      </div>

      {alerts.length > 0 ? (
        <div className="flex flex-col gap-3">
          {alerts.map((item) => (
            <div key={item.id}
              className="flex items-center justify-between p-3 md:p-4 bg-cream/60 border border-chocolate/10 rounded-xl hover:border-sage-green transition-all group">
              {/* Plant Detail */}
              <div className="flex gap-3 items-center">
                <div className="p-4 h-full rounded-lg flex items-center justify-center bg-blue-300 text-blue-500">
                  <FontAwesomeIcon icon={faDroplet} className="w-3! md:w-5! h-3! md:h-5!"/>
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <h1 className="font-bold text-chocolate text-sm group-hover:text-chocolate/90">
                    {item.plantName}
                  </h1>
                  <span className="text-chocolate/60 text-xs">{item.location}</span>

                  <span className="text-xs font-semibold text-red-500 rounded">
                      ความชื้น {item.moisture}%
                  </span>
                </div>
              </div>

              {/* Button */}
              <button onClick={() => handleWaterSingle(item.id)}
                    className="flex text-xs items-center gap-1 bg-sage-green hover:bg-sage-green/80 text-chocolate font-bold px-3 py-2 rounded-lg transition-all active:scale-95 shadow-sm">
                <FontAwesomeIcon icon={faCheck} className="w-3! h-3!" /> รดน้ำแล้ว
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 justify-center flex flex-col items-center bg-cream/30 border border-chocolate/20 rounded-xl">
          <div className="p-3 bg-sage-green/20 text-sage-green rounded-full flex items-center justify-center mb-2">
            <FontAwesomeIcon icon={faCheck} className="w-6! h-6!" />
          </div>
          <h1 className="font-bold text-chocolate text-sm">รดน้ำครบทุกต้นเรียบร้อยแล้ว!</h1>
          <span className="text-chocolate/60 text-xs mt-1">เก่งมากๆๆๆๆ</span>
        </div>
      )}
    </div>
  );
}
