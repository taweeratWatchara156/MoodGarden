"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Navbar from "../components/Navbar"
import PlantDetails from "../components/PlantDetails"
import PlantName from "../components/PlantName"
import WaterAlertList from "../components/WaterAlertList"
import { useMqttStore } from "../zustand/mqttState"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"

export default function main() {
  const { isConnected } = useMqttStore();

  return (
    <div className="flex flex-col gap-3 md:gap-5 lg:gap-7 p-3 lg:p-7 flex-1 bg-cream">
        {/* Navbar */}
        <Navbar/>

        {/* Monitor Screen */}
          <PlantName/>
          <PlantDetails/>
          <WaterAlertList/>
          <div className={`${isConnected ? 'hidden' : 'flex'} flex-1 bg-white p-5 rounded-2xl border-gray-200 border`}>
            <div className={`flex-1 flex flex-col gap-3 bg-cream/30 p-5 justify-center items-center rounded-2xl border-gray-200 border`}>
              <FontAwesomeIcon icon={faTriangleExclamation} className="w-7! xl:w-10! h-7! xl:h-10! text-sage-green p-5 bg-sage-green/20 rounded-full "/>
              <h1 className="text-chocolate/80 font-bold text-2xl xl:text-3xl">เชื่อมต่อ MQTT ก่อนน!!!</h1>
              <span className="text-chocolate/60 font-bold text-base xl:text-lg">กดปุ่มขวาบน</span>
            </div>
          </div>
    </div>
  )
}
