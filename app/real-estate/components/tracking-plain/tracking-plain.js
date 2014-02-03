TrackingPlain = Component.create({
  name: 'tracking-plain',
  source: User.head,
  centerX:0,
  centerZ:0,
  animateArrow:true,
  currentX:0,
  currentZ:0,
  loopReady:false,

  //x - measured in pixels, half of Kinect x-axis span
  //z - measured in mm
  optimalPosition: {x:720,z:1400},
  //radius in which will activate next screen
  optimalRadius: {x:150,z:150},
  transitionDuration: 500,
  moveVideo:false,
  plainDownReady:true,
  plainUpReady:true,
  plainState:"up",
  //css: ['transformed-plain', 'component'],
  durationPlain:500,
  plainText: " ",

  switchText: '',
  switchTextReady: true,
  videoFeed: null,

  startscreenShown: false,

  html: function(){
    return JST[this.name](this);
  },

  shown: function(){
    this.loopReady = true;
    //this.guidancePosition._shown();
    this.switchText = '';
    this.switchTextReady = true;

    //set variable allow hint animation
    this.animateArrow = true;

    var localSource = this.source;

    var zValue = this.subElm(".tracking-plain-inner").css("height");
    var xValue = this.subElm(".tracking-plain-inner").css("width");
    localSource.x = parseInt(xValue)/2;
    localSource.z = parseInt(zValue)/2;

    var objectWidth = this.subElm(".static-object").css("width");
    var objectHeight = this.subElm(".static-object").css("height");
    var objectWidth = parseInt(objectWidth)/2;
    var objectHeight = parseInt(objectHeight)/2;

    this.centerX = localSource.x - objectWidth;
    this.centerZ = 325;//localSource.z - objectHeight;
    this.subElm(".static-object").css({left:this.centerX});
    this.subElm(".static-object").css({top:this.centerZ});

    this.plainState = "up";
    this.plainDown("startup");

  },

  moveDown: function(){

  },

  moveUp: function(){

  },

  fadeIn: function(){

  },

  fadeOut: function(){

  },

  plainDown:function(callType){

    var self = this;

    //only run if plain is up
    if(this.plainState=="up"){

      if(callType == 'in position'){
        this.plainState = "complete";
        this.moveDown();
        var t = setTimeout(function(){
          self.inPosition();
        }, 1500);
      }
      else{
        this.plainState = "down";
        this.fadeIn();
      }

      this.subElm('.container').css({'-webkit-transform':'rotateX(130deg)'});
      this.subElm(".human-object").css({opacity:0});

    }
  },

  plainUp: function(){

    var self = this;

    //run only is the plain is down
    if(this.plainState=="down"){
      this.fadeOut();
      this.plainState = "up";
      this.subElm('.container').css({'-webkit-transform':'rotateX(45deg)'});
      this.subElm(".human-object").css({opacity:1});
    }
  },


  update:function(){

    this.updateTrackedUser();

    //differnce between current and optimal positions
    var plainWidth = this.subElm(".plain").css("width");
    var centreXPlain = parseInt(plainWidth)/2;

    var deltaX = Math.abs(this.source.x - 1920/2);
    var deltaZ = Math.abs(this.source.z - this.optimalPosition.z);

    if((deltaX<this.optimalRadius.x)&&(deltaZ<this.optimalRadius.z)&&(AdmoApp.currentState==3)){
      this._inPosition();
    }
    else{
      this.checkState();
    }

  },

  _inPosition: function(){
    this.plainDown("in position");
  },

  //do when in position
  inPosition: function(){
  },

  updateTrackedUser:function(){

    var self = this;

    //get center of plain to position elements around it
    var plainHeight = this.subElm(".plain").css("height");
    var plainWidth = this.subElm(".plain").css("width");

    var centreXPlain = parseInt(plainWidth)/2;
    var centreYPlain = parseInt(plainHeight)/2;

    //get centre point for dynamic element on screen
    var objectWidth = parseInt(this.subElm(".human-object").css("width"));
    var objectHeight = parseInt(this.subElm(".human-object").css("height"));

    /****
    linear equation for determining kinect.x coordinates relative to the width of the transposed div
    ****/

    var zVars = {x1 : 400,x2 : 4000, y1 : -100, y2 : 800};
    var m1 = (zVars.y2 - zVars.y1)/(zVars.x2 - zVars.x1);
    var c1 = zVars.y1 - zVars.x1*m1;

    var xVars = {x1 : 0,x2 : 1920, y1 : 100, y2 : 1820};
    var m2 = (xVars.y2 - xVars.y1)/(xVars.x2 - xVars.x1);
    var c2 = xVars.y1 - xVars.x1*m2;

    var plainX = m2*User.head.x + c2;
    var plainY = m1*User.head.z + c1;
    var humanX = plainX - objectWidth/2;
    var humanY = plainY;

    this.subElm(".human-object").css({left:humanX,top:humanY});


  },

  //check state and change what is showing onscreen
  checkState:function(){
    var self = this;

    if(AdmoApp.currentState==1){
      if(this.plainState=="up"){
        this.plainDown("stateChange");
      }
    }
    else if((AdmoApp.currentState==3)||(AdmoApp.currentState==2)){
      if(this.plainState=="down"){
        this.plainUp();
      }
    }
  },


});

