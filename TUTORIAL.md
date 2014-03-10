# Connecting to Chrome

Google has recently expanded their Chrome browsers to include a new feature called Chrome Apps. These apps allow access to the host computers hardware including serial and USB ports. We are going to leverage this new feature to create a nice clean GUI for controlling an Arduino with very little difficulty.

**[Download the Tutorial Code](https://github.com/Element-43/001-Connecting-to-Chrome)**

## Part 1 - Setting Up the Arduino

We'll be creating a very simple Arduino program that turns an LED on and off. The Arduino will receive the command through the serial port.

    #define LED_PIN 13

    void setup() {

      Serial.begin(9600);

      pinMode(LED_PIN, OUTPUT);

    }

    void loop() {

      if (Serial.available()) {
        uint8_t command = Serial.read();

        if (command == 1) {
          pinMode(LED_PIN, HIGH);
        } else if (command == 0) {
          pinMode(LED_PIN, LOW);
        }

      }

    }

The circuitry for this tutorial is an LED wired to pin 13 with a resistor.

## Part 2 - Starting a Chrome App

We won't be going in too deep with the setup of a Chrome App. You can find an easy to follow tutorial on the [Chrome Developer site](https://developer.chrome.com/apps/first_app). You'll need to create a folder on your desktop to store these files. Next you'll need to add these basic files to the folder. You can read more about these files on the Chrome website.

### manifest.json

    {
      // This is required for every app
      "manifest_version": 2,
      "name": "Connecting to Chrome",
      "version": "1.0.0",
      "app": {
        "background": {
          "scripts": ["background.js"]
        }
      },

      // Needed to get to the serial ports
      "permissions": ["serial"]
    }

### background.js

    // Runs this function when the application is opened
    chrome.app.runtime.onLaunched.addListener(function() {

      // Create a new window using the file `./window.html`
      chrome.app.window.create('window.html', {

        // Make the window 500px by 255px
        'bounds': {
          'width': 500,
          'height': 255
        },
        resizable: false
      });

    });

### window.html

    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Connecting to Chrome</title>

      <!-- Styles the GUI -->
      <link rel="stylesheet" href="style.css">
    </head>
    <body>

      <!-- UI Elements -->
      <div class="row">
        <div class="small-4 columns"><select name="port-selection" id="port-selection"></select></div>
        <div class="small-4 columns"><button id="port-connect" class="button secondary small expand">Connect</button></div>
      </div>

      <div class="row">
        <div class="small-2 columns"><button id="led-on" class="button expand">LED On</button></div>
        <div class="small-2 columns"><button id="led-off" class="button expand">LED Off</button></div>
        <div class="small-4 columns"><button id="led-toggle" class="button expand">LED Toggle</button></div>
      </div>

      <!-- The applications code. -->
      <script src="app.js"></script>

    </body>
    </html>

### style.css

This file is optional and only is used to style the GUI. It can be [downloaded here]().

### Install Plug-in

In order to launch the app you'll have to install it in the browser. Visit `chrome://extensions` and enable developer mode. There should be a new `Load Unpacked Extension` button, click it and navigate to where your folder is. You should now be able to start the Chrome App in the browser.

## Part 3 - Application Programming

In the `window.html` file we added an included JavaScript file call `app.js`.This file is the heart of the program that connects to the Chrome browser to the Arduino so we'll be going through it in detail. We'll be writing a JavaScript class to take care of this.

### Creating the Class

We'll create the class using a very basic structure. If you are unfamiliar with JavaScript you can find great free tutorials on [Codecademy](http://www.codecademy.com/tracks/javascript).

    function CTC() {

      // A collection of the GUI elements
      this.port      = document.getElementById('port-selection');
      this.connect   = document.getElementById('port-connect');
      this.ledOff    = document.getElementById('led-off');
      this.ledOn     = document.getElementById('led-on');
      this.ledToggle = document.getElementById('led-toggle');

      // Stats variables
      this.updatingConnection = false;
      this.connection         = null;
      this.ledStatus          = false;

      // Start up functions
      this.updatePorts();
      this.attachEvents();

    }

    // Ensures the constructor is set correctly
    CTC.prototype.constructor = CTC;

This function will be called when you create a new instance of the `CTC` class.

### Updating the Ports

We have an empty select box on our GUI at the moment. We need to write a function that finds all the serial ports currently available on the computer and list them as options.

    CTC.prototype.updatePorts = function() {

      // A reference to the CTC object for use in callbacks
      var self = this;


      // Ask Chrome to find any serial devices
      chrome.serial.getDevices(function (ports) {

        // Go through each device
        ports.forEach(function (port) {

          // Create a new option element
          var option = document.createElement('option');

          // Set the elements properties
          option.innerHTML = port.path;
          option.value = port.path;

          // Add it to the select box
          self.port.appendChild(option);

        }); // END forEach

      }); // END getDevices

    };

### Attaching Events

JavaScript is an event-ed language. We will need to attach some events to our application for it to preform actions.

    CTC.prototype.attachEvents = function() {

      // A reference to the CTC object for use in callbacks
      var self = this;

      // Connects to the selected port
      self.connect.addEventListener('click', function () {
        self.updateConnection();
      });

      // Sends the off command
      self.ledOff.addEventListener('click', function () {
        self.ledStatus = false;
        self.transmit(false);
      });

      // Sends the on command
      self.ledOn.addEventListener('click', function () {
        self.ledStatus = true;
        self.transmit(true);
      });

      // Sends the opposite command of the current status
      self.ledToggle.addEventListener('click', function () {
        self.ledStatus = !self.ledStatus;
        self.transmit(self.ledStatus);
      });

    };

### Create a Connection

We'll need a function to create a connection with the Arduino.

    // Connection settings for an Arduino serial connection
    CTC.ArduinoConnection = {
      bitrate:    9600,
      dataBits:   "eight",
      parityBit:  "no",
      stopBits:   "one"
    };

    CTC.prototype.updateConnection = function() {

      // A reference to the CTC object for use in callbacks
      var self = this;

      // Prevent the function from firing more than once
      if (self.updatingConnection) {
        return;
      }

      // Lock the function
      self.updatingConnection = true;

      // If a connection isn't made, then make one.
      if (!self.connection) {

        // Update the status text
        self.connect.classList.add('disabled');
        self.connect.innerHTML = 'Connecting...';

        // Ask chrome to create a connection
        chrome.serial.connect(self.port.value, CTC.ArduinoConnection, function (info) {

          // Store the connection
          self.connection = info;

          // Unlock the function
          self.updatingConnection = false;

          // Update the status text
          self.connect.classList.remove('disabled');
          self.connect.innerHTML = 'Disconnect';

        });

      // If there is already a connection, destroy it.
      } else {

        // Update the status text
        self.connect.classList.add('disabled');
        self.connect.innerHTML = 'Disconnecting...';


        // Ask Chrome to close the connection
        chrome.serial.disconnect(self.connection.connectionId, function (result) {

          // Clear the stored connection information
          self.connection = null;

          // Unlock the function
          self.updatingConnection = false;

          // Update the status text
          self.connect.classList.remove('disabled');
          self.connect.innerHTML = 'Connect';

        });

      }

    };

### Transmit Data

Now we need to send information to the Arduino so that it can turn the LED on and off.

    CTC.prototype.transmit = function(action) {

      // A reference to the CTC object for use in callbacks
      var self = this;

      // Chrome's serial API expects data to be sent as a data buffer.
      var buffer = new Uint8Array(1);

      // Sets the data in the buffer
      buffer[0] = action ? 1 : 0;

      // Transmit the data to the Arduino
      chrome.serial.send(self.connection.connectionId, buffer.buffer, function (sendInfo) {});

    };

### Start CTC when the App is Ready

We don't want any of this code to run before the application is actually ready for it. So we will attach it to the DOM ready event.

    document.addEventListener('DOMContentLoaded', function () {

      // Start the CTC class
      window.CTC = new CTC();

    });

## Part 4 - Using Your Application

Your coding is done and you can now connect your application to your Arduino. Open your Chrome browser and open the apps page by clicking on the App button or open `chrome://apps`. Find the `Connecting to Chrome` application and open it. You just need to select your Arduino's serial port and connected.

### Troubleshooting

This tutorial doesn't cover anything as far as error handling so your application has the potential to fail without giving you a reason. Here are some places to check for breaks if you are having problems.

1. The application doesn't make sure it actually connected to the device, so make sure that you don't have any other programs or instances of this application accessing the Arduino.
2. You can make sure the connection settings are correct by opening the JavaScript console for the application by right clicking in the application window, then select `Inspect Element`, and in the window that opens changing it to the `Console` tab. There is a global `CTC` object that you can reference to see variable status.
3. The console will alert you to any error that are caused by your code and you should be able to fix them.
4. If you still can't figure it out, then leave a message in the comments below.

## Conclusion

In my opinion the new Chrome App platform opens up a new world of possibilities for Arduino lovers. In minutes you can create beautiful GUIs to manage your hardware, access your computer's file system, and even gain access to third-party online resources like Google Maps, Twitter, Facebook, etc. Since Chrome Apps run on HTML, CSS, and JavaScript you have a vast network of already experienced programmer and designers that can answer your questions, as well as a plethora of tools, libraries and frameworks at your disposal.

There is another new feature that is being added to Chrome that I didn't touch on in this tutorial, and that is [Native Client](https://developer.chrome.com/native-client/index). NaCl allows programmers to write and compile C/C++ code that can run in the web browser. These programs can be interfaced with Chrome Apps so that you can have an easy to use and manage GUI while still having the ability to run low-level calculations.

### More Resources

* [Tutorial Code](https://github.com/Element-43/001-Connecting-to-Chrome)
* [Codecademy](http://codecademy.com)
* [Chrome App](https://developer.chrome.com/apps/about_apps)
* [Chrome Native Client](https://developer.chrome.com/native-client/index)

