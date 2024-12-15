// Libraries and sensor initialization
#include <Wire.h>
#include "MAX30105.h"
#include "spo2_algorithm.h"
#include "heartRate.h"

MAX30105 particleSensor;

#define MAX_BRIGHTNESS 255
#define PUBLISH_INTERVAL 10000 // 10 seconds

uint32_t irBuffer[100]; // Infrared LED sensor data
uint32_t redBuffer[100]; // Red LED sensor data

int32_t bufferLength = 100; // Buffer length
int32_t spo2 = 0;           // SpO2 value
int32_t heartRate = 0;      // Heart rate value

long lastPublishTime = 0; // Tracks the last publish time

void setup() {
    Serial.begin(115200);

    // Initialize the MAX30105 sensor
    if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
        Serial.println(F("MAX30105 not found. Please check wiring/power."));
        while (1);
    }

    // Configure the sensor
    particleSensor.setup(60, 4, 2, 100, 411, 4096); // Set LED brightness, sample rate, etc.
    Serial.println("Sensor initialized.");

    // Subscribe to webhook responses
    Particle.subscribe("hook-response/bpm", myHandler, MY_DEVICES);
}

void loop() {
    // Read 100 samples into buffers
    for (byte i = 0; i < bufferLength; i++) {
        while (!particleSensor.available())
            particleSensor.check();

        redBuffer[i] = particleSensor.getRed();
        irBuffer[i] = particleSensor.getIR();
        particleSensor.nextSample();

        Serial.print(F("red="));
        Serial.print(redBuffer[i], DEC);
        Serial.print(F(", ir="));
        Serial.println(irBuffer[i], DEC);
    }

    // Calculate SpO2 and heart rate
    maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, nullptr, &heartRate, nullptr);

    // Print calculated values
    Serial.print(F("SPO2="));
    Serial.print(spo2, DEC);
    Serial.print(F(", HR="));
    Serial.println(heartRate, DEC);

    // Publish data to ThingSpeak every 10 seconds
    if (millis() - lastPublishTime >= PUBLISH_INTERVAL) {
        if(spo2 > 0){
        String data = String::format("{\"spo2\": \"%d\", \"bpm\": \"%d\"}", spo2, heartRate);
        bool success = Particle.publish("bpm_server", data, PRIVATE);
        
         if (success) {
            Serial.println("Data published successfully."); // publishing checkers
        } else {
            Serial.println("Data publish failed.");
        }

        }

        lastPublishTime = millis();
    }

    delay(1000); // Prevent loop flooding
}

void myHandler(const char *event, const char *data) {
    Serial.println("Webhook response received.");
}
