; (function () {

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

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  CTC.ArduinoConnection = {
    bitrate:    9600,
    dataBits:   "eight",
    parityBit:  "no",
    stopBits:   "one"
  };

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

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

  document.addEventListener('DOMContentLoaded', function () {

    // Start the CTC class
    window.CTC = new CTC();

  });

})();