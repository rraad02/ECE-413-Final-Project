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
long lastReminderTime = 0; // Tracks last LED reminder time
long lastMeasurementTime = 0; // Tracks the last time a measurement was taken
const long LED_REMINDER_INTERVAL = 30000; // 30 seconds
const long MEASUREMENT_COOLDOWN = 30000;  // 30 seconds cooldown

// Time configuration
const int START_HOUR = 6; // 6:00 AM
const int END_HOUR = 22;  // 10:00 PM

// State machine
enum DeviceState {
    IDLE,
    REMIND_MEASUREMENT
};

DeviceState currentState = IDLE;

void setup() {
    Serial.begin(115200);

    // Set the local time zone
    Time.zone(-7); // UTC-7 for Arizona

    // Take control of the built-in RGB LED
    RGB.control(true);

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
    if (isWithinActiveHours()) {
        switch (currentState) {
            case IDLE:
                if (millis() - lastReminderTime >= LED_REMINDER_INTERVAL && millis() - lastMeasurementTime >= MEASUREMENT_COOLDOWN) {
                    currentState = REMIND_MEASUREMENT;
                }
                Serial.println("idle");
                break;

            case REMIND_MEASUREMENT:
                setBuiltInLEDColor(0, 0, 255); // Blue LED
                delay(500); // Flash blue briefly
                setBuiltInLEDColor(0, 0, 0); // Turn off LED
                delay(500);
                Serial.println("measurement");
                lastReminderTime = millis();
                currentState = IDLE;
                break;
        }
    }

    // Existing functionality remains unchanged
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
        if (spo2 > 0) {
            String data = String::format("{\"spo2\": \"%d\", \"bpm\": \"%d\"}", spo2, heartRate);
            bool success = Particle.publish("bpm_server", data, PRIVATE);

            if (success) {
                Serial.println("Data published successfully.");
                lastMeasurementTime = millis(); // Update measurement time on successful publish
                setBuiltInLEDColor(0, 255, 0); // Green LED
                delay(500); // Flash green briefly
                setBuiltInLEDColor(0, 0, 0); // Turn off LED
            } else {
                Serial.println("Data publish failed.");
            }
        }

        lastPublishTime = millis();
    }

    delay(1000); // Prevent loop flooding
}

bool isWithinActiveHours() {
    int currentHour = Time.hour(); // Directly get the current hour
    return currentHour >= START_HOUR && currentHour < END_HOUR;
}

void setBuiltInLEDColor(uint8_t red, uint8_t green, uint8_t blue) {
    RGB.color(red, green, blue);
}

void myHandler(const char *event, const char *data) {
    Serial.println("Webhook response received.");
}
