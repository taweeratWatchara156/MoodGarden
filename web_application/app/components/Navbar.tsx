"use client"


import { faCaretRight, faCircle, faSeedling, faSpinner, faTruckLoading, faWifi } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useMqttStore } from "../zustand/mqttState";

export default function Navbar() {
const { isConnected, isConnecting, connectMqtt, disconnectMqtt } = useMqttStore();
  const [time, setTime] = useState<String>("");
  const [date, setDate] = useState<String>("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      setTime(now.toLocaleTimeString("th-TH", { hour12: false }));
      
      setDate(
        now.toLocaleDateString("th-TH", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex p-3 md:p-5 lg:p-6 justify-between bg-chocolate rounded-2xl items-center shadow-xl">
          {/* Logo */}
          <div className="icon flex items-center">
            {/* Logo Icon */}
            <div className="flex bg-sage-green p-3 md:p-4 mr-2 md:mr-3 rounded-lg md:rounded-xl">
              <FontAwesomeIcon icon={faSeedling} className="text-chocolate w-4! md:w-5! xl:w-6! h-4! md:h-5! xl:h-6!"/>
            </div>

            {/* Text */}
            <div className="hidden md:flex flex-col">
              <h1 className="text-white font-bold text-xl md:text-2xl lg:text-3xl">
                Mood<span className="text-warm-yellow">Health</span> <span className="text-sage-green font-normal">Monitor</span>
              </h1>

              <span className="flex text-xs md:text-sm xl:text-md gap-1 md:gap-2 text-gray-200 items-center">
                <FontAwesomeIcon icon={faCaretRight} className="w-fit! h-3! md:h-4! xl:h-5! text-sage-green"/>
                Physical Computer Project - PlantHealth
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            { isConnected ? (
                <div className="flex gap-2">
                        <div className="lg:text-sm xl:text-base text-cream border-green-400 px-5 gap-2 hidden lg:flex items-center rounded-full border bg-chocolate-dark font-bold">
                        <FontAwesomeIcon icon={faCircle} className="text-green-400 lg:h-3! xl:h-4!"/>
                        เชื่อมต่อ MQTT แล้ว
                    </div>
                    <button onClick={disconnectMqtt} className="text-xs md:text-sm xl:text-base py-1 text-cream cursor-pointer  outline-none hover:text-white-400 hover:bg-red-800 duration-100 border-red-400 px-3 md:px-5 gap-2 flex items-center rounded-full border bg-chocolate-dark font-bold">
                        <FontAwesomeIcon icon={faCircle} className="text-red-400 h-2! md:h-3! xl:h-4!"/>
                        ตัดการเชื่อมต่อ
                    </button>
                </div>
                
            )
                : 
                <button onClick={connectMqtt} disabled={isConnecting} className="text-xs md:text-sm xl:text-base text-warm-yellow py-1 px-3 md:px-5 gap-2 flex items-center bg-warm-yellow/10 rounded-lg md:rounded-full border border-warm-yellow/20 cursor-pointer font-bold hover:bg-warm-yellow/30 duration-100 hover:text-chocolate outline-none">
                    { isConnecting ? <FontAwesomeIcon icon={faSpinner} className="animate-spin"/> : <FontAwesomeIcon icon={faWifi}/> }
                    { isConnecting ? 'กำลังเชื่อมต่อ MQTT' : 'เชื่อมต่อ MQTT' }
                </button>
            }

            {/* Date & Time */}
            <div className="hidden lg:flex lg:text-sm xl:text-base gap-2 text-warm-yellow border-warm-yellow border items-center rounded-full h-fit px-3 py-1 bg-chocolate-dark">
                <span>{time}</span>
                |
                <span>{date}</span>
            </div>
          </div>
        </div>
  )
}
