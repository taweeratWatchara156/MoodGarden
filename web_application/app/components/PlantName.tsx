"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import { faDroplet } from "@fortawesome/free-solid-svg-icons"
import { useMqttStore } from "../zustand/mqttState";
import { useState } from "react";

export default function PlantName() {
    const { isConnected, plantName, plantLocation } = useMqttStore();
    const [ lastWateredTime, setLastWateredTime ] = useState<string>("วันนี้, 3:38 PM");

    const handleWateringButton = () => {
      const now = new Date();

      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      setLastWateredTime(`วันนี้, ${formattedTime}`);
    };
  
    return (
    <div className={`${isConnected ? 'flex' : 'hidden'} flex-col`}>
          {/* Plant Detail */}
          <div className="bg-white justify-between flex p-3 md:p-5 items-center rounded-2xl border-gray-200 border">
            {/* Plant Icon & Name */}
            <div className="flex gap-2 md:gap-3 items-center">
              {/* Plant Icon */}
              <div className="border-warm-yellow border rounded-xl p-2 text-md md:text-xl lg:text-2xl bg-yellow-100">🪴</div>

              {/* Name */}
              <div className="hidden md:flex flex-col">
                <h1 className="font-bold text-chocolate text-sm md:text-base lg:text-xl">{plantName}</h1>
                <h1 className="text-xs md:text-sm lg:text-base text-gray-400">{plantLocation}</h1>
              </div>

              {/* Name | Phone */}
              <div className="flex flex-col md:hidden">
                <div className="flex flex-row items-center gap-1">
                  <h1 className="font-bold text-chocolate text-sm md:text-base lg:text-xl">{plantName}</h1>
                  <h1> | </h1>
                  <h1 className="text-xs md:text-sm lg:text-base text-gray-400">{plantLocation}</h1>
                </div>

                {/* Last watered time */}
                <div className="flex gap-1 lg:gap-2 items-center h-fit">
                  <h1 className="text-xs lg:text-base text-gray-400">รดน้ำล่าสุด: <span className="font-bold">{lastWateredTime}</span></h1>
                </div>
              </div>
            </div>

            {/* Last watered time */}
            <div className="hidden md:flex gap-1 lg:gap-2 items-center h-fit">
              <FontAwesomeIcon icon={faClock} className="text-yellow-600 h-3! lg:h-4!"/>
              <h1 className="text-sm lg:text-base text-gray-400">รดน้ำล่าสุด: <span className="font-bold">{lastWateredTime}</span></h1>
            </div>

            {/* Press if just water button */}
            <button onClick={handleWateringButton} className="hidden md:flex text-sm lg:text-base bg-blue-300 text-white font-bold shadow-lg rounded-xl lg:rounded-2xl px-3 lg:px-5 py-2 hover:bg-blue-400 duration-100 cursor-pointer hover:shadow-md">
              <FontAwesomeIcon icon={faDroplet} className="h-3! lg:h-4! pr-1 lg:pr-2"/>
              กดปุ่มถ้ารดน้ำแล้ว
            </button>
            <button onClick={handleWateringButton} className="flex md:hidden text-sm lg:text-base bg-blue-300 text-white font-bold shadow-lg rounded-xl lg:rounded-2xl px-3 lg:px-5 py-4 md:py-2 hover:bg-blue-400 duration-100 cursor-pointer hover:shadow-md">
              <FontAwesomeIcon icon={faDroplet} className="h-3! lg:h-4! pr-1 lg:pr-2"/>
            </button>
          </div>
        </div>
  )
}
