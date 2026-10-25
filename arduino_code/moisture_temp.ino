#include <OneWire.h>
#include <DallasTemperature.h>
#define ONE_WIRE_BUS 3
#include <LiquidCrystal_I2C.h>
#include<WiFiS3.h>
#include<MQTT.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);

int msPin = A0;

const char WIFI_SSID[] = "Mild_2.4G";
const char WIFI_PASSWORD[] = "0378084652";

const char MQTT_BROKER_ADDRESS[] = "mqtt-dashboard.com";
const int MQTT_PORT = 1883;
const char MQTT_CLIENT_ID[] = "arduino-uno-r4-client"; 
const char MQTT_USERNAME[] = "";
const char MQTT_PASSWORD[] = "";

const char PUBLISH_SENSOR_TOPIC[] = "r4/plant/sensor";
const char SUBSCRIBE_TOPIC[] = "r4/led/toggle";
const char plantName[] = "ต้นกะเพรา";
const char plantLocation[] = "ที่บ้าน ชั้น 3";

WiFiClient network;
MQTTClient mqtt = MQTTClient(512);

const int PUBLISH_INTERVAL = 2000;  // 5 seconds
unsigned long lastPublishTime = 0;

void setup() {
  Serial.begin(9600);
  analogReadResolution(10);
  tempSensor.begin();
  Serial.print("Found DS18B20 devices: ");
  Serial.println(tempSensor.getDeviceCount()); // ควรจะพิมพ์เลข 1 ออกมา
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Connecting WiFi...");

  int status = WL_IDLE_STATUS;
  while(status != WL_CONNECTED){
    Serial.print("Arduino R4 - Attempting to connect to SSID: ");
    Serial.println(WIFI_SSID);

    status = WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    delay(10000);
  }

  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connecting MQTT..");

  connectToMQTT();
  
  lcd.clear();
}

void updateLCD(int soil, float temp) {
  lcd.setCursor(0, 0);
  lcd.print("Soil: ");
  lcd.print(soil);
  lcd.print("%   ");

  lcd.setCursor(0, 1);
  lcd.print("Temp: ");
  lcd.print(temp, 1);
  lcd.print((char)223);
  lcd.print("C   ");
}

void loop() {
  mqtt.loop();

  if (!mqtt.connected()) {
    connectToMQTT();
  }

  if (millis() - lastPublishTime >= PUBLISH_INTERVAL) {
    lastPublishTime = millis();
    
    int rawSoil = analogRead(msPin);
    int soilPercent = map(rawSoil, 1000, 539, 0, 100); 
    soilPercent = constrain(soilPercent, 0, 100);

    tempSensor.requestTemperatures();
    float tempC = tempSensor.getTempCByIndex(0);

    if (tempC == -127.00 || tempC == 85.00) {
      Serial.println("DS18B20 Error: Read failed!");
    } else {
      updateLCD(soilPercent, tempC);
      sendSensorData(soilPercent, tempC);
    }
  }
}

void sendSensorData(int soil, float temp) {
  String payload = "{";
  payload += "\"plantName\":\"" + String(plantName) + "\",";
  payload += "\"plantLocation\":\"" + String(plantLocation) + "\",";
  payload += "\"soil\":" + String(soil) + ",";
  payload += "\"temp\":" + String(temp, 1);
  payload += "}";

  mqtt.publish(PUBLISH_SENSOR_TOPIC, payload);
  Serial.println("Published: " + payload);
}

void connectToMQTT(){
  mqtt.begin(MQTT_BROKER_ADDRESS, MQTT_PORT, network);
  mqtt.onMessage(messageReceived);
  Serial.print("R4 UNO - Connecting to MQTT broker");
  while(!mqtt.connect(MQTT_CLIENT_ID, MQTT_USERNAME, MQTT_PASSWORD)){
    Serial.print(".");
    delay(100);
  }
  Serial.println();

  if(!mqtt.connected()){
    Serial.println("R4 - MQTT broker Timeout!");
    return;
  }

  if(mqtt.subscribe(SUBSCRIBE_TOPIC))
    Serial.print("R4 UNO - Subscribed to the topic: ");
  else
    Serial.print("R4 UNO - Failed to subscribe to the topic: ");

  Serial.println(SUBSCRIBE_TOPIC);
  Serial.println("R4 UNO - MQTT broker Connected!");
}

void messageReceived(String &topic, String &payload) {
  Serial.println("R4 - received from MQTT:");
  Serial.println("- topic: " + topic);
  Serial.print("- payload:");
  Serial.println(payload);

  payload.trim();
}
