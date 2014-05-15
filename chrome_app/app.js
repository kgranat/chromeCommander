; (function () 
{
  function CTC() {

    // A collection of the GUI elements
    this.port      = document.getElementById('port-selection');
    this.connect   = document.getElementById('port-connect');
    
    this.calc      = document.getElementById('calc');
    this.move      = document.getElementById('move');
    this.delta     = document.getElementById('delta').value;
    this.grip      = document.getElementById('grip').value;
    this.wristangle = document.getElementById('wristangle').value;
    this.wristrotate = document.getElementById('wristrotate').value;
    this.zpos      = document.getElementById('zpos').value;
    this.xpos      = document.getElementById('xpos').value;
    this.ypos      = document.getElementById('ypos').value;
    
    
    

    
    
    
    
    
    this.cart      = document.getElementById('cart');
    this.cart90      = document.getElementById('cart90');
    this.cyl      = document.getElementById('cyl');
    this.cyl90      = document.getElementById('cyl90');
    this.backhoe      = document.getElementById('backhoe');
    this.sleep      = document.getElementById('sleep');
    
    
    

    // Stats variables
    this.updatingConnection = false;
    this.connection         = null;
    


    this.buffer = new Uint8Array(17);


    // Start up functions
    this.updatePorts();
    this.attachEvents();
    this.sendToArms();

  }

  // Ensures the constructor is set correctly
  CTC.prototype.constructor = CTC;

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  CTC.ArduinoConnection = 
  {
    bitrate:    38400,
    dataBits:   "eight",
    parityBit:  "no",
    stopBits:   "one"
  };

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  CTC.prototype.updatePorts = function() 
  {

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

  CTC.prototype.attachEvents = function() 
  {

    // A reference to the CTC object for use in callbacks
    var self = this;


    var buffer = new Uint8Array(17);


    // Connects to the selected port
    self.connect.addEventListener('click', function () {
      self.updateConnection();
    });



	self.move.addEventListener('click', function () 
	{

		var x = document.getElementById('xpos').value; 
		
		var y = document.getElementById('ypos').value; 
		
		var z = document.getElementById('zpos').value;
		
		var wang = document.getElementById('wristangle').value;
		
		var wrot = document.getElementById('wristrotate').value;
		
		var grip = document.getElementById('grip').value;
		
		var delta =document.getElementById('delta').value;
		
		//var button =
		
		var ext = 0;
		
		self.sendToArms(x,y,z,wang,wrot,grip,delta,ext);
		

		//	document.getElementById("packet").innerHTML="Deltamove";

    });





	self.calc.addEventListener('click', function () 
	{
		sendToArm(0,0,0,0,0,0,0,0x20);
				document.getElementById("packet").innerHTML="X Coordinate";

	
	
    });


  




	self.cart.addEventListener('click', function () 
	{


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
		self.buffer[16] = 255-(( self.buffer[1] +  self.buffer[2] +  self.buffer[3] +  self.buffer[4] + self.buffer[5] + self.buffer[6] + self.buffer[7] +  self.buffer[8] + self.buffer[9] +  self.buffer[10] + self.buffer[11] + self.buffer[12] + self.buffer[13] + self.buffer[14] + self.buffer[15] )%256);
	//    self.buffer[16] = 255-(( self.buffer[1] +  self.buffer[2] +  self.buffer[3] +  self.buffer[4] + self.buffer[5] + self.buffer[6] + self.buffer[7] +  self.buffer[8] + self.buffer[9] +  self.buffer[10] + self.buffer[11] + self.buffer[12] + self.buffer[13] + self.buffer[14] + self.buffer[15] )%256);
	  
	  
	
		self.transmit(self.buffer);
		
		
		
		
		console.log('change');
		//	$('#cart').addClass("selected");  
			
			//document.getElementById("cart").className = " selected";
			
			
			
		cartButton=document.getElementById("cart");
		cartButton.className=cartButton.className.replace(" inactiveMode","  activeMode"); // first remove the class name if that already exists
			
		cart90Button=document.getElementById("cart90");
		cart90Button.className=cart90Button.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
		
		cylButton=document.getElementById("cyl");
		cylButton.className=cylButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
		
		cylButton=document.getElementById("cyl90");
		cylButton.className=cylButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
			
		backhoeButton=document.getElementById("backhoe");
		backhoeButton.className=backhoeButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
		
		sleepButton=document.getElementById("sleep");
		sleepButton.className=sleepButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
		
	
	
	
		//set labels //
		
		document.getElementById("xposlabel").innerHTML="X Coordinate 90";
		document.getElementById("yposlabel").innerHTML="Y Coordinate 90";
		document.getElementById("zposlabel").innerHTML="Z Coordinate 90";
		document.getElementById("wristanglabel").innerHTML="Wrist Angle";
		document.getElementById("wristrotlabel").innerHTML="Wrist Rotate";
		document.getElementById("griplabel").innerHTML="Gripper";
		document.getElementById("deltalabel").innerHTML="Delta";
		document.getElementById("packet").innerHTML="Delta111";
		
		setValues(512,200,200,90,512,256);


		
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
    self.buffer[15] = 0x28;//Extended Instruction go home 3d cartesian
    self.buffer[16] = 255-(( self.buffer[1] +  self.buffer[2] +  self.buffer[3] +  self.buffer[4] + self.buffer[5] + self.buffer[6] + self.buffer[7] +  self.buffer[8] + self.buffer[9] +  self.buffer[10] + self.buffer[11] + self.buffer[12] + self.buffer[13] + self.buffer[14] + self.buffer[15] )%256);
    console.log('test3');
    console.log(self.buffer[0]);


    self.transmit(self.buffer);
    
    
  		
	cartButton=document.getElementById("cart");
	cartButton.className=cartButton.className.replace(" activeMode","  inactiveMode"); // first remove the class name if that already exists
		
	cart90Button=document.getElementById("cart90");
	cart90Button.className=cart90Button.className.replace(" inactiveMode","  activeMode"); // first remove the class name if that already exists
	
	cylButton=document.getElementById("cyl");
	cylButton.className=cylButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	
	cylButton=document.getElementById("cyl90");
	cylButton.className=cylButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
		
	backhoeButton=document.getElementById("backhoe");
	backhoeButton.className=backhoeButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	
	sleepButton=document.getElementById("sleep");
	sleepButton.className=sleepButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	

	changeLabels("test", "test2");
	setValues(512,150,30,0,512,256);

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
    self.buffer[15] = 0x30;//Extended Instruction go home 3d cartesian
    self.buffer[16] = 255-(( self.buffer[1] +  self.buffer[2] +  self.buffer[3] +  self.buffer[4] + self.buffer[5] + self.buffer[6] + self.buffer[7] +  self.buffer[8] + self.buffer[9] +  self.buffer[10] + self.buffer[11] + self.buffer[12] + self.buffer[13] + self.buffer[14] + self.buffer[15] )%256);
    console.log('test3');
    console.log(self.buffer[0]);


    self.transmit(self.buffer);  
    
    //Set Button Colors//
	cartButton=document.getElementById("cart");
	cartButton.className=cartButton.className.replace(" activeMode","  inactiveMode"); // first remove the class name if that already exists
		
	cart90Button=document.getElementById("cart90");
	cart90Button.className=cart90Button.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	
	cylButton=document.getElementById("cyl");
	cylButton.className=cylButton.className.replace(" inactiveMode","  activeMode"); // first remove the class name if that already exists
	
	cylButton=document.getElementById("cyl90");
	cylButton.className=cylButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
		
	backhoeButton=document.getElementById("backhoe");
	backhoeButton.className=backhoeButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	
	sleepButton=document.getElementById("sleep");
	sleepButton.className=sleepButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	

	setValues(512,200,200,90,512,256);
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
    self.buffer[15] = 0x38;//Extended Instruction go home 3d cartesian
    self.buffer[16] = 255-(( self.buffer[1] +  self.buffer[2] +  self.buffer[3] +  self.buffer[4] + self.buffer[5] + self.buffer[6] + self.buffer[7] +  self.buffer[8] + self.buffer[9] +  self.buffer[10] + self.buffer[11] + self.buffer[12] + self.buffer[13] + self.buffer[14] + self.buffer[15] )%256);
    console.log('test3');
    console.log(self.buffer[0]);


    self.transmit(self.buffer);
    
    //Set Button Colors//
	cartButton=document.getElementById("cart");
	cartButton.className=cartButton.className.replace(" activeMode","  inactiveMode"); // first remove the class name if that already exists
		
	cart90Button=document.getElementById("cart90");
	cart90Button.className=cart90Button.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	
	cylButton=document.getElementById("cyl");
	cylButton.className=cylButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	
	cylButton=document.getElementById("cyl90");
	cylButton.className=cylButton.className.replace(" inactiveMode","  activeMode"); // first remove the class name if that already exists
		
	backhoeButton=document.getElementById("backhoe");
	backhoeButton.className=backhoeButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	
	sleepButton=document.getElementById("sleep");
	sleepButton.className=sleepButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	

		setValues(512,150,30,0,512,256);
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
    self.buffer[15] = 0x40;//Extended Instruction go home 3d cartesian
    self.buffer[16] = 255-(( self.buffer[1] +  self.buffer[2] +  self.buffer[3] +  self.buffer[4] + self.buffer[5] + self.buffer[6] + self.buffer[7] +  self.buffer[8] + self.buffer[9] +  self.buffer[10] + self.buffer[11] + self.buffer[12] + self.buffer[13] + self.buffer[14] + self.buffer[15] )%256);
    console.log('test3');
    console.log(self.buffer[0]);


    self.transmit(self.buffer);
    
    //Set Button Colors//
	cartButton=document.getElementById("cart");
	cartButton.className=cartButton.className.replace(" activeMode","  inactiveMode"); // first remove the class name if that already exists
		
	cart90Button=document.getElementById("cart90");
	cart90Button.className=cart90Button.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	
	cylButton=document.getElementById("cyl");
	cylButton.className=cylButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	
	cylButton=document.getElementById("cyl90");
	cylButton.className=cylButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
		
	backhoeButton=document.getElementById("backhoe");
	backhoeButton.className=backhoeButton.className.replace(" inactiveMode","  activeMode"); // first remove the class name if that already exists
	
	sleepButton=document.getElementById("sleep");
	sleepButton.className=sleepButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	

	setValues(512,512,512,512,512,256);
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
    self.buffer[15] = 0x60;//Extended Instruction go home 3d cartesian
    self.buffer[16] = 255-(( self.buffer[1] +  self.buffer[2] +  self.buffer[3] +  self.buffer[4] + self.buffer[5] + self.buffer[6] + self.buffer[7] +  self.buffer[8] + self.buffer[9] +  self.buffer[10] + self.buffer[11] + self.buffer[12] + self.buffer[13] + self.buffer[14] + self.buffer[15] )%256);
    console.log('test3');
    console.log(self.buffer[0]);


    self.transmit(self.buffer);
    
    //Set Button Colors//
	cartButton=document.getElementById("cart");
	cartButton.className=cartButton.className.replace(" activeMode","  inactiveMode"); // first remove the class name if that already exists
		
	cart90Button=document.getElementById("cart90");
	cart90Button.className=cart90Button.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	
	cylButton=document.getElementById("cyl");
	cylButton.className=cylButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	
	cylButton=document.getElementById("cyl90");
	cylButton.className=cylButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
		
	backhoeButton=document.getElementById("backhoe");
	backhoeButton.className=backhoeButton.className.replace(" activeMode"," inactiveMode"); // first remove the class name if that already exists
	
	sleepButton=document.getElementById("sleep");
	sleepButton.className=sleepButton.className.replace(" inactiveMode","  activeMode"); // first remove the class name if that already exists
	

    });
    
    
    



  };
        
        
        
        
  function changeLabels(arm, mode)
  
  {
    document.getElementById("xposlabel").innerHTML="X Coordinate";
    document.getElementById("yposlabel").innerHTML="Y Coordinate";
    document.getElementById("zposlabel").innerHTML="Z Coordinate";
    document.getElementById("wristanglabel").innerHTML="Wrist Angle";
    document.getElementById("wristrotlabel").innerHTML="Wrist Rotate";
    document.getElementById("griplabel").innerHTML="Gripper";
    document.getElementById("deltalabel").innerHTML="Delta";
    document.getElementById("xposlabel").innerHTML=arm;
    document.getElementById("yposlabel").innerHTML=mode;
    
  
  }
  
  
  function setValues(x, y, z, wang, wrot, grip)
  {
    document.getElementById("xpos").value=x;
    document.getElementById("ypos").value=y;
    document.getElementById("zpos").value=z;
    document.getElementById("wristangle").value=wang;
    document.getElementById("wristrotate").value=wrot;
    document.getElementById("grip").value=grip;
    
  
  }
  
  
  
  function sendToArm(x,y,z, wang, wrot, grip, delta,ext)
  {

    
        //self.buffer[1] + " " +  self.buffer[2]
//	document.getElementById("packet").innerHTML= "rawr" ;
  
  
    var self = this;

  
  
    this.buffer[0] = parseInt(0xff);
    
    
    
  			document.getElementById("packet").innerHTML="Deltamove2";



  }
  
  
  
   CTC.prototype.sendToArms =  function(x,y,z, wang, wrot, grip, delta,ext)
  {

    
        //
//	document.getElementById("packet").innerHTML= "rawr" ;
  
  
  
    this.buffer[0] = parseInt(0xff);
    this.buffer[1] =  parseInt((x >> 8)& 0xff);
    this.buffer[2] = parseInt(x & 0xff);
    this.buffer[3] =  parseInt((y >> 8)& 0xff);
    this.buffer[4] = parseInt(y & 0xff);
    this.buffer[5] = parseInt((z >> 8)& 0xff);
    this.buffer[6] = parseInt(z & 0xff);
    this.buffer[7] = parseInt((wang >> 8)& 0xff);
    this.buffer[8] = parseInt(wang & 0xff);
    this.buffer[9] = parseInt((wrot >> 8)& 0xff);
    this.buffer[10] = parseInt(wrot & 0xff);
    this.buffer[11] = parseInt((grip >> 8)& 0xff);
    this.buffer[12] = parseInt(grip & 0xff);
    this.buffer[13] = parseInt(delta & 0xff);
    this.buffer[14] = parseInt(0x00);//button
    this.buffer[15] = parseInt(ext);

    this.buffer[16] = 255-(( this.buffer[1] +  this.buffer[2] +  this.buffer[3] +  this.buffer[4] + this.buffer[5] + this.buffer[6] + this.buffer[7] +  this.buffer[8] + this.buffer[9] +  this.buffer[10] + this.buffer[11] + this.buffer[12] + this.buffer[13] + this.buffer[14] )%256);


    // = 0xBF;
    //console.log('test3');
    //console.log(self.delta);
    //console.log(self.buffer[0]);
    //console.log(self.buffer[1]);
    //console.log(self.buffer[2]);
    //console.log(self.buffer[3]);
    //console.log(self.buffer[4]);
    //console.log(self.buffer[5]);
    //console.log(self.buffer[6]);
    //console.log(self.buffer[7]);
    //console.log(self.buffer[8]);
    //console.log(self.buffer[9]);
    //console.log(self.buffer[10]);
    //console.log(self.buffer[11]);
    //console.log(self.buffer[12]);
    //console.log(self.buffer[13]);
    //console.log(self.buffer[14]);
    //console.log(self.buffer[15]);
    //console.log(self.buffer[16]);

 	this.transmit(this.buffer);
    
    
    var packetString =  + " 0x" + this.buffer[1].toString(16).toUpperCase()+ " 0x" +  this.buffer[2].toString(16).toUpperCase()+ " 0x" +  this.buffer[3].toString(16).toUpperCase()+ " 0x" +  this.buffer[4].toString(16).toUpperCase()+ " 0x" +  this.buffer[5].toString(16).toUpperCase()+ " 0x" +  this.buffer[6].toString(16).toUpperCase()+ " 0x" +  this.buffer[7].toString(16).toUpperCase()+ " 0x" +  this.buffer[8].toString(16).toUpperCase()+ " 0x" +  this.buffer[9].toString(16).toUpperCase()+ " 0x" +  this.buffer[10].toString(16).toUpperCase()+ " 0x" +  this.buffer[11].toString(16).toUpperCase()+ " 0x" +  this.buffer[12].toString(16).toUpperCase()+ " 0x" +  this.buffer[13].toString(16).toUpperCase()+ " 0x" +  this.buffer[14].toString(16).toUpperCase()+ " 0x" +  this.buffer[15].toString(16).toUpperCase()+ " 0x" +  this.buffer[16].toString(16);
    
    
    
    
  	document.getElementById("hex0").innerHTML = "0x" + this.buffer[0].toString(16).toUpperCase();
  	document.getElementById("hex1").innerHTML = "0x" + this.buffer[1].toString(16).toUpperCase();
  	document.getElementById("hex2").innerHTML = "0x" + this.buffer[2].toString(16).toUpperCase();
  	document.getElementById("hex3").innerHTML = "0x" + this.buffer[3].toString(16).toUpperCase();
  	document.getElementById("hex4").innerHTML = "0x" + this.buffer[4].toString(16).toUpperCase();
  	document.getElementById("hex5").innerHTML = "0x" + this.buffer[5].toString(16).toUpperCase();
  	document.getElementById("hex6").innerHTML = "0x" + this.buffer[6].toString(16).toUpperCase();
  	document.getElementById("hex7").innerHTML = "0x" + this.buffer[7].toString(16).toUpperCase();
  	document.getElementById("hex8").innerHTML = "0x" + this.buffer[8].toString(16).toUpperCase();
  	document.getElementById("hex9").innerHTML = "0x" + this.buffer[9].toString(16).toUpperCase();
  	document.getElementById("hex10").innerHTML = "0x" + this.buffer[10].toString(16).toUpperCase();
  	document.getElementById("hex11").innerHTML = "0x" + this.buffer[11].toString(16).toUpperCase();
  	document.getElementById("hex12").innerHTML = "0x" + this.buffer[12].toString(16).toUpperCase();
  	document.getElementById("hex13").innerHTML = "0x" + this.buffer[13].toString(16).toUpperCase();
  	document.getElementById("hex14").innerHTML = "0x" + this.buffer[14].toString(16).toUpperCase();
  	document.getElementById("hex15").innerHTML = "0x" + this.buffer[15].toString(16).toUpperCase();
  	document.getElementById("hex16").innerHTML = "0x" + this.buffer[16].toString(16).toUpperCase();
    
    
  	document.getElementById("dec0").innerHTML =  this.buffer[0].toString(10);
  	document.getElementById("dec1").innerHTML =  this.buffer[1].toString(10);
  	document.getElementById("dec2").innerHTML =  this.buffer[2].toString(10);
  	document.getElementById("dec3").innerHTML =  this.buffer[3].toString(10);
  	document.getElementById("dec4").innerHTML =  this.buffer[4].toString(10);
  	document.getElementById("dec5").innerHTML =  this.buffer[5].toString(10);
  	document.getElementById("dec6").innerHTML =  this.buffer[6].toString(10);
  	document.getElementById("dec7").innerHTML =  this.buffer[7].toString(10);
  	document.getElementById("dec8").innerHTML =  this.buffer[8].toString(10);
  	document.getElementById("dec9").innerHTML =  this.buffer[9].toString(10);
  	document.getElementById("dec10").innerHTML =  this.buffer[10].toString(10);
  	document.getElementById("dec11").innerHTML =  this.buffer[11].toString(10);
  	document.getElementById("dec12").innerHTML =  this.buffer[12].toString(10);
  	document.getElementById("dec13").innerHTML =  this.buffer[13].toString(10);
  	document.getElementById("dec14").innerHTML =  this.buffer[14].toString(10);
  	document.getElementById("dec15").innerHTML =  this.buffer[15].toString(10);
  	document.getElementById("dec16").innerHTML =  this.buffer[16].toString(10);


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
