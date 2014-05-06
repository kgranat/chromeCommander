; (function () {

  function CTC() {

    // A collection of the GUI elements
    this.port      = document.getElementById('port-selection');
    this.connect   = document.getElementById('port-connect');
    this.ledOff    = document.getElementById('led-off');
    this.ledOn     = document.getElementById('led-on');
    this.ledToggle = document.getElementById('led-toggle');
    this.calc      = document.getElementById('calc');
    this.move      = document.getElementById('move');
    this.calc      = document.getElementById('cart');
    this.move      = document.getElementById('cart90');
    this.calc      = document.getElementById('cyl');
    this.move      = document.getElementById('cyl90');
    this.calc      = document.getElementById('backhoe');
    this.move      = document.getElementById('sleep');
    this.delta     = document.getElementById('delta').value;
    this.grip      = document.getElementById('grip').value;
    this.wristangle = document.getElementById('wristangle').value;
    this.wristrotate = document.getElementById('wristrotate').value;
    this.zpos      = document.getElementById('zpos').value;
    this.xpos      = document.getElementById('xpos').value;
    this.ypos      = document.getElementById('ypos').value;

    // Stats variables
    this.updatingConnection = false;
    this.connection         = null;
    this.ledStatus          = false;


    this.buffer = new Uint8Array(17);


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
    bitrate:    38400,
    dataBits:   "eight",
    parityBit:  "no",
    stopBits:   "one"
  };

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  CTC.prototype.updatePorts = function() {

    // A reference to the CTC object for use in callbacks
    var self = this,
        getDevices = chrome.serial.getDevices || chrome.serial.getPorts;


    // Ask Chrome to find any serial devices
    getDevices(function (ports) {

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


    var buffer = new Uint8Array(17);

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
    
    
    
	self.moves.addEventListener('click', function () {



    self.buffer[0] = 0xff;
    self.buffer[1] = parseInt(((document.getElementById('xpos').value) >> 8)& 0xff);
    self.buffer[2] = parseInt(((document.getElementById('xpos').value)) & 0xff);
    self.buffer[3] = parseInt(((document.getElementById('ypos').value) >> 8)& 0xff);
    self.buffer[4] = parseInt(((document.getElementById('ypos').value)) & 0xff);
    self.buffer[5] = parseInt(((document.getElementById('zpos').value) >> 8)& 0xff);
    self.buffer[6] = parseInt(((document.getElementById('zpos').value)) & 0xff);
    self.buffer[7] = parseInt(((document.getElementById('wristangle').value) >> 8)& 0xff);
    self.buffer[8] = parseInt(((document.getElementById('wristangle').value)) & 0xff);
    self.buffer[9] = parseInt(((document.getElementById('wristrotate').value) >> 8)& 0xff);
    self.buffer[10] = parseInt(((document.getElementById('wristrotate').value)) & 0xff);
    self.buffer[11] = parseInt(((document.getElementById('grip').value) >> 8)& 0xff);
    self.buffer[12] = parseInt(((document.getElementById('grip').value)) & 0xff);
    self.buffer[13] = parseInt(((document.getElementById('delta').value)) & 0xff);
    self.buffer[14] = 0x00;
    self.buffer[15] = 0x00;

    self.buffer[16] = 255-(( self.buffer[1] +  self.buffer[2] +  self.buffer[3] +  self.buffer[4] + self.buffer[5] + self.buffer[6] + self.buffer[7] +  self.buffer[8] + self.buffer[9] +  self.buffer[10] + self.buffer[11] + self.buffer[12] + self.buffer[13] + self.buffer[14] )%256);


    self.transmit(self.buffer);
    });





	self.move.addEventListener('click', function () {


    self.buffer[0] = 0xff;//header
    self.buffer[1] = 0x00;//X-Axis High
    self.buffer[2] = 0x00;//X-Axis Low
    self.buffer[3] = 0x00;//Y-Axis High
    self.buffer[4] = 0x00;//Y-Axis Low
    self.buffer[5] = 0x00;//Z-Axis High
    self.buffer[6] = 0x00;//Z-Axis Low
    self.buffer[7] = 0x00;//Wrist Angle High
    self.buffer[8] = 0x00;//Wrist Angle Low
    self.buffer[9] = 0x00;//Wrist Rotate High
    self.buffer[10] = 0x00;//Wrist Rotate Low
    self.buffer[11] = 0x00;// Gripper High
    self.buffer[12] = 0x00;//Gripper Low
    self.buffer[13] = 0x00;//Delta Value
    self.buffer[14] = 0x00;//Button Value
    self.buffer[15] = 0x20;//Extended Instruction go home 3d cartesian
    //self.buffer[16] = 255-(( self.buffer[1] +  self.buffer[2] +  self.buffer[3] +  self.buffer[4] + self.buffer[5] + self.buffer[6] + self.buffer[7] +  self.buffer[8] + self.buffer[9] +  self.buffer[10] + self.buffer[11] + self.buffer[12] + self.buffer[13] + self.buffer[14] + self.buffer[15] )%256);


    self.buffer[16] = 0xDF;//Checksum
    console.log('test3');
    console.log(self.buffer[0]);


    self.transmit(self.buffer);
    });
    
    
    
    





	self.cart.addEventListener('click', function () {


    self.buffer[0] = 0xff;//header
    self.buffer[1] = 0x00;//X-Axis High
    self.buffer[2] = 0x00;//X-Axis Low
    self.buffer[3] = 0x00;//Y-Axis High
    self.buffer[4] = 0x00;//Y-Axis Low
    self.buffer[5] = 0x00;//Z-Axis High
    self.buffer[6] = 0x00;//Z-Axis Low
    self.buffer[7] = 0x00;//Wrist Angle High
    self.buffer[8] = 0x00;//Wrist Angle Low
    self.buffer[9] = 0x00;//Wrist Rotate High
    self.buffer[10] = 0x00;//Wrist Rotate Low
    self.buffer[11] = 0x00;// Gripper High
    self.buffer[12] = 0x00;//Gripper Low
    self.buffer[13] = 0x00;//Delta Value
    self.buffer[14] = 0x00;//Button Value
    self.buffer[15] = 0x20;//Extended Instruction go home 3d cartesian
    self.buffer[16] = 0xDF;//Checksum
//    self.buffer[16] = 255-(( self.buffer[1] +  self.buffer[2] +  self.buffer[3] +  self.buffer[4] + self.buffer[5] + self.buffer[6] + self.buffer[7] +  self.buffer[8] + self.buffer[9] +  self.buffer[10] + self.buffer[11] + self.buffer[12] + self.buffer[13] + self.buffer[14] + self.buffer[15] )%256);
  
  

    self.transmit(self.buffer);
    });
    





	self.cart90.addEventListener('click', function () {


    self.buffer[0] = 0xff;//header
    self.buffer[1] = 0x00;//X-Axis High
    self.buffer[2] = 0x00;//X-Axis Low
    self.buffer[3] = 0x00;//Y-Axis High
    self.buffer[4] = 0x00;//Y-Axis Low
    self.buffer[5] = 0x00;//Z-Axis High
    self.buffer[6] = 0x00;//Z-Axis Low
    self.buffer[7] = 0x00;//Wrist Angle High
    self.buffer[8] = 0x00;//Wrist Angle Low
    self.buffer[9] = 0x00;//Wrist Rotate High
    self.buffer[10] = 0x00;//Wrist Rotate Low
    self.buffer[11] = 0x00;// Gripper High
    self.buffer[12] = 0x00;//Gripper Low
    self.buffer[13] = 0x00;//Delta Value
    self.buffer[14] = 0x00;//Button Value
    self.buffer[15] = 0x20;//Extended Instruction go home 3d cartesian
    self.buffer[16] = 0xDF;//Checksum
    console.log('test3');
    console.log(self.buffer[0]);


    self.transmit(self.buffer);
    });
    





	self.cyl.addEventListener('click', function () {


    self.buffer[0] = 0xff;//header
    self.buffer[1] = 0x00;//X-Axis High
    self.buffer[2] = 0x00;//X-Axis Low
    self.buffer[3] = 0x00;//Y-Axis High
    self.buffer[4] = 0x00;//Y-Axis Low
    self.buffer[5] = 0x00;//Z-Axis High
    self.buffer[6] = 0x00;//Z-Axis Low
    self.buffer[7] = 0x00;//Wrist Angle High
    self.buffer[8] = 0x00;//Wrist Angle Low
    self.buffer[9] = 0x00;//Wrist Rotate High
    self.buffer[10] = 0x00;//Wrist Rotate Low
    self.buffer[11] = 0x00;// Gripper High
    self.buffer[12] = 0x00;//Gripper Low
    self.buffer[13] = 0x00;//Delta Value
    self.buffer[14] = 0x00;//Button Value
    self.buffer[15] = 0x20;//Extended Instruction go home 3d cartesian
    self.buffer[16] = 0xDF;//Checksum
    console.log('test3');
    console.log(self.buffer[0]);


    self.transmit(self.buffer);
    });
    
    





	self.cyl90.addEventListener('click', function () {


    self.buffer[0] = 0xff;//header
    self.buffer[1] = 0x00;//X-Axis High
    self.buffer[2] = 0x00;//X-Axis Low
    self.buffer[3] = 0x00;//Y-Axis High
    self.buffer[4] = 0x00;//Y-Axis Low
    self.buffer[5] = 0x00;//Z-Axis High
    self.buffer[6] = 0x00;//Z-Axis Low
    self.buffer[7] = 0x00;//Wrist Angle High
    self.buffer[8] = 0x00;//Wrist Angle Low
    self.buffer[9] = 0x00;//Wrist Rotate High
    self.buffer[10] = 0x00;//Wrist Rotate Low
    self.buffer[11] = 0x00;// Gripper High
    self.buffer[12] = 0x00;//Gripper Low
    self.buffer[13] = 0x00;//Delta Value
    self.buffer[14] = 0x00;//Button Value
    self.buffer[15] = 0x20;//Extended Instruction go home 3d cartesian
    self.buffer[16] = 0xDF;//Checksum
    console.log('test3');
    console.log(self.buffer[0]);


    self.transmit(self.buffer);
    });
    
    





	self.backhoe.addEventListener('click', function () {


    self.buffer[0] = 0xff;//header
    self.buffer[1] = 0x00;//X-Axis High
    self.buffer[2] = 0x00;//X-Axis Low
    self.buffer[3] = 0x00;//Y-Axis High
    self.buffer[4] = 0x00;//Y-Axis Low
    self.buffer[5] = 0x00;//Z-Axis High
    self.buffer[6] = 0x00;//Z-Axis Low
    self.buffer[7] = 0x00;//Wrist Angle High
    self.buffer[8] = 0x00;//Wrist Angle Low
    self.buffer[9] = 0x00;//Wrist Rotate High
    self.buffer[10] = 0x00;//Wrist Rotate Low
    self.buffer[11] = 0x00;// Gripper High
    self.buffer[12] = 0x00;//Gripper Low
    self.buffer[13] = 0x00;//Delta Value
    self.buffer[14] = 0x00;//Button Value
    self.buffer[15] = 0x20;//Extended Instruction go home 3d cartesian
    self.buffer[16] = 0xDF;//Checksum
    console.log('test3');
    console.log(self.buffer[0]);


    self.transmit(self.buffer);
    });
    





	self.sleep.addEventListener('click', function () {


    self.buffer[0] = 0xff;//header
    self.buffer[1] = 0x00;//X-Axis High
    self.buffer[2] = 0x00;//X-Axis Low
    self.buffer[3] = 0x00;//Y-Axis High
    self.buffer[4] = 0x00;//Y-Axis Low
    self.buffer[5] = 0x00;//Z-Axis High
    self.buffer[6] = 0x00;//Z-Axis Low
    self.buffer[7] = 0x00;//Wrist Angle High
    self.buffer[8] = 0x00;//Wrist Angle Low
    self.buffer[9] = 0x00;//Wrist Rotate High
    self.buffer[10] = 0x00;//Wrist Rotate Low
    self.buffer[11] = 0x00;// Gripper High
    self.buffer[12] = 0x00;//Gripper Low
    self.buffer[13] = 0x00;//Delta Value
    self.buffer[14] = 0x00;//Button Value
    self.buffer[15] = 0x20;//Extended Instruction go home 3d cartesian
    self.buffer[16] = 0xDF;//Checksum
    console.log('test3');
    console.log(self.buffer[0]);


    self.transmit(self.buffer);
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

  CTC.prototype.transmit = function(buffer) {

    // A reference to the CTC object for use in callbacks
    var self = this;


   //  // Chrome's serial API expects data to be sent as a data buffer.

   //  // Sets the data in the buffer
   // // buffer[0] = action ? 1 : 0;

   //  var buffer = new Uint8Array(17);
 		// buffer[0] = 0xff;
 		// buffer[1] = 0x00;
 		// buffer[2] = 0x00;
 		// buffer[3] = 0x00;
 		// buffer[4] = 0x00;
 		// buffer[5] = 0x00;
 		// buffer[6] = 0x00;
 		// buffer[7] = 0x00;
 		// buffer[8] = 0x00;
 		// buffer[9] = 0x00;
 		// buffer[10] = 0x00;
 		// buffer[11] = 0x00;
 		// buffer[12] = 0x00;
 		// buffer[13] = 0x00;
 		// buffer[14] = 0x00;
 		// buffer[15] = 0x40;
 		// buffer[16] = 0xBF;




    // Transmit the data to the Arduino
    chrome.serial.send(self.connection.connectionId, buffer.buffer, function (sendInfo) {});

  };

  document.addEventListener('DOMContentLoaded', function () {

    // Start the CTC class
    window.CTC = new CTC();

  });

})();
