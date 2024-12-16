University of Arizona 2024 Fall ECE413
Final Project - Team X

Project Description:
The Heart Track application is a cost-effective, IoT-enabled web app designed for continuous monitoring of heart rate and blood oxygen saturation levels. Measurements are taken at intervals specified by the user or physician.
An IoT device equipped with heart rate and oxygen sensors periodically reminds users to record their measurements. These measurements are then transmitted to a web application where users or physicians can easily access and analyze the data.
Key features include:
Configurable Measurement Schedule: Users or physicians can define the time of day and frequency for measurements.
Seamless Monitoring: The web app provides a clear and intuitive interface for tracking heart rate and blood oxygen saturation levels.
Responsive Design: The application is optimized for desktop, tablet, and mobile devices, ensuring a smooth user experience across platforms.


Team members:
Ryan Raad
Robert Tkaczyk
Emma Halferty


Demo: 
Demo URL: ec2-18-206-205-37.compute-1.amazonaws.com:3000
Test Infomation: FIX ME ADD PASSWORD/USER INFO


Videos:
Pitch Video: https://youtu.be/ZERyI-n4N8k
User Experience: [PROVIDE YOUR YOUTUBE VIDEO LINK HERE]
Code Implements: [PROVIDE YOUR YOUTUBE VIDEO LINK HERE]


How to Run the Project:

1. Running on localhost
Steps to set up and run the project locally:
Download Files: Download the zipped project files and extract them to a directory of your choice.
Install Visual Studio Code: If you don’t already have Visual Studio Code installed, download and install it.
Open the Project: Launch Visual Studio Code, go to File > Open Folder, and select the folder where you extracted the project files.
Install Node Modules: Open a new terminal in Visual Studio Code and run:
$ npm install
Run the Application: Start the server by running the following command in the terminal:
$ node app.js
Access the Application: Open your browser and navigate to localhost:3000. The Home page should load, allowing you to interact with the app.

2. Setting Up the Particle Device
The project uses a Particle Photon or Argon device (only one is required).
Steps to set up the device and circuit:
Set Up the Particle Board: Follow the official quickstart guide here: Particle Setup Guide.
Build the Circuit: Gather the following components:
Particle Photon/Argon board
MAX30102 Heart Rate Sensor
Jumper cables
Breadboard
LED
2.2kOhm resistor
Circuit Connections:
Connect 5V/3.3V on the Particle board to Vin on the sensor.
Connect SDA on the Particle to SDA on the sensor.
Connect SCL on the Particle to SCL on the sensor.
Connect GND on the sensor to GND on the Particle.
Connect the LED (in series with the resistor) to pin D4 and GND.
Program the Particle Device:
Open a new Visual Studio Code window.
Create a new Particle project and import the files from the /embeddedDevice folder (includes the .ino file and required libraries).

3. Running on an AWS EC2 Server
Follow these steps to run the project on your own AWS server:
Set Up an AWS EC2 Server:
Follow steps 1-4 in this guide to create an AWS account and configure an EC2 server:
AWS EC2 Setup Guide.
Upload Project Files: Skip to step 6 in the guide to upload the project files to your server.
Run the Server: Refer to steps 7 and 8 in the guide to start the application.
Install MongoDB: If MongoDB is not installed on your EC2 server, follow the instructions here:
Install MongoDB on AWS EC2.
4. Accessing the Application on Our Server
To view the running application on our server, paste the following URL into your browser:
https://ec2-3-139-106-23.us-east-2.compute.amazonaws.com:3000/

Note: The server requires the terminal to remain open.
