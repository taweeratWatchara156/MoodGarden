"use client"

import { faDroplet, faTemperature1 } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useMqttStore } from '../zustand/mqttState';

export default function PlantDetails() {
  const { isConnected, soilMoisture, temperature } = useMqttStore();
  const [moisture, setMoisture] = useState<number>(91.4);

  const getMoistureStatus = (soil: number): string => {
    if (soil < 33) return "แห้งเกินไป";
    if (soil <= 66) return "ปกติ";
    return "เปียกเกินไป";
  };

  const getTempStatus = (temp: number): string => {
    if (temp < 18) return "เย็นเกินไป";
    if (temp <= 28) return "ปกติ";
    return "ร้อนเกินไป";
  };

  const moistureStatus = getMoistureStatus(soilMoisture);
  const tempStatus = getTempStatus(temperature);

  return (
    <div className={`${ isConnected ? 'flex' : 'hidden' } flex-col gap-7`}>
      <div className='flex flex-col lg:flex-row gap-3 md:gap-5 lg:gap-7'>
        {/* Moisture Detail */}
        <div className="w-full lg:w-1/2 bg-white gap-5 justify-between flex flex-col p-3 md:p-5 rounded-2xl border-gray-200 border">
          {/* Title */}
          <div className='flex justify-between'>
            <div className="flex items-center gap-3">
              <div className="flex text-blue-500 bg-blue-300 p-3 rounded-xl">
                <FontAwesomeIcon icon={faDroplet} className='h-4! lg:h-6! w-4! lg:w-6!'/>
              </div>
              
              <div className='flex flex-col'>
                <h1 className='text-base md:text-lg lg:text-xl font-bold text-chocolate'>Soil Moisture</h1>
                <span className='text-xs md:text-sm lg:text-base text-gray-400'>ความชื้นของดิน</span>
              </div>
            </div>

            <div className='flex gap-1 md:gap-2 items-center'>
              <h1 className='text-xs md:text-sm lg:text-base text-chocolate'>status:</h1>
              <div className={`text-white text-xs md:text-sm lg:text-base
                  ${moistureStatus == "ปกติ" ? "bg-green-500" : moistureStatus == "แห้งเกินไป" ? "bg-red-500" : moistureStatus == "เปียกเกินไป" ? "bg-blue-500" : "bg-black"}
                    px-3 rounded-xl py-1 font-bold`}>
                {moistureStatus}
              </div>
            </div>
          </div>

          {/* Moisture Percent */}
          <div className='flex flex-col gap-3'>
            <h1 className='font-bold text-4xl lg:text-5xl text-chocolate'>{soilMoisture}%</h1>
            <div className="w-full bg-cream rounded-full h-3 lg:h-4 overflow-hidden border border-chocolate/10 p-0.5">
              <div
                className="bg-sage-green h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${soilMoisture}%` }}
              />
            </div>
          </div>

          <div className='flex text-xs md:text-sm lg:text-base justify-between border-t pt-3 border-gray-300 text-gray-400'>
            <h1>แห้งเกินไป ( 0% )</h1>
            <h1>ปกติ ( 50% )</h1>
            <h1>เปียกเกินไป ( 100% )</h1>
          </div>
        </div>
        {/* Temp Detail */}
        <div className="w-full lg:w-1/2 bg-white gap-5 flex flex-col p-3 md:p-5 rounded-2xl border-gray-200 border">
          {/* Title */}
          <div className='flex justify-between'>
            <div className="flex items-center gap-3">
              <div className="flex text-orange-600 bg-orange-300 p-3 rounded-xl">
                <FontAwesomeIcon icon={faTemperature1} className='h-4! lg:h-6! w-4! lg:w-6!'/>
              </div>
              
              <div className='flex flex-col'>
                <h1 className='text-base md:text-lg lg:text-xl font-bold text-chocolate'>Soil Temperature</h1>
                <span className='text-xs md:text-sm lg:text-base text-gray-400'>อุณหภูมิของดิน</span>
              </div>
            </div>

            <div className='flex gap-1 md:gap-2 items-center'>
              <h1 className='text-xs md:text-sm lg:text-base text-chocolate'>status:</h1>
              <div className={`text-white text-xs md:text-sm lg:text-base
                  ${tempStatus == "ปกติ" ? "bg-green-500" : tempStatus == "ร้อนเกินไป" ? "bg-red-500" : tempStatus == "เย็นเกินไป" ? "bg-blue-500" : "bg-black"}
                    px-3 rounded-xl py-1 font-bold`}>
                {tempStatus}
              </div>
            </div>
          </div>

          {/* Temperature Detail */}
          <div className='flex flex-col gap-3'>
            <h1 className='items-baseline font-bold flex text-4xl lg:text-5xl text-chocolate'>{temperature}<span className="text-2xl lg:text-3xl text-sage-green">&deg;C</span></h1>
            <h1 className='text-xs md:text-sm lg:text-base text-gray-400'>อุณหภูมิปกติ: 18&deg;C - 28&deg;C</h1>
          </div>

          <div className='text-[10px] md:text-sm lg:text-base flex justify-between border-t pt-3 border-gray-300 text-gray-400'>
            <h1>เย็นเกินไป ( &lt; 18&deg;C )</h1>
            <h1>ปกติ ( 18&deg;C - 28&deg;C )</h1>
            <h1>ร้อนเกินไป ( &gt; 28&deg;C )</h1>
          </div>
        </div>
      </div>
    </div>
  )
}
