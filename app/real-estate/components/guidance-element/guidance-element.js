//*****************************************************************
// GuidanceElement provides an animation between the specified hand
// and one of the specified active buttons on screen
//*****************************************************************
GuidanceElement = Component.create( {

  startElement: User.hands.right,
  //This can be ANY Component or any object that has a reference to the x,y,buttonRadius
  //Set this to a default value for now. each screen will set this eventually
  endElement: {
    currentPosition: { x: 0, y: 0},
    buttonRadius: 0
  },
  duration: 500,
  imagePath: null,
  imageSize: {width: 200, height: 200},

  lineThickness:150,

  elementRadius: 50,

  //rotate moving image relative to rotation of containing div
  imageRotationFixed: false,
  name: 'guidance-element',

  buttonQuantity:0,
  buttonSwitch:true,
  buttonIndex:0,


  updateButtonInfo:function(){
  },

  update: function() {
    var self = this;

    this.updateButtonInfo();

    if(this.buttonQuantity==0){
      this.positionElement();
    }
    else{

      if(this.buttonSwitch){
        this.buttonSwitch = false;

        var timeoutName = 'buttonswtich'+this.id;

        this.addTimeout(timeoutName,function(){

          self.element.transition({opacity:0},500,function(){

            self.buttonIndex++;

            if(self.buttonIndex > self.buttonQuantity){
              self.buttonIndex = 0;
            }

            self.element.transition({opacity:1},500);
          });

          self.buttonSwitch = true;

        },2000);

      }

      this.positionElement();

    }

  },

  positionElement: function(){

    var thickness = this.imageSize.height;

    var startX = this.startElement.x*this.scale + this.scaleOffset.x;
    var startY = this.startElement.y*this.scale + this.scaleOffset.y;

    var endX = this.endElement.currentPosition.x;
    var endY = this.endElement.currentPosition.y;

    //distance between points
    var length = Math.sqrt(((endX-startX) * (endX-startX)) + ((endY-startY) * (endY-startY)));

    var cx = ((startX + endX) / 2) - (length / 2);
    var cy = ((startY + endY) / 2) - (thickness / 2);

    //angle betweem points
    var angle = Math.atan2((startY-endY),(startX-endX))*(180/Math.PI);

    this.subElm('.channel').css({
      'height':thickness,
      'left': cx,
      'top':cy,
      'width':length,
      '-webkit-transform':'rotate(' + angle + 'deg)'
    });

    //rotate moving image relative to rotation of containing div
    if(this.imageRotationFixed){
      this.subElm('.inner').css({
        '-webkit-transform':'rotate(' + (-angle) + 'deg)'
      });
    }

    //Recalcute the cy bassed on the line thickness as well
    var thickness = this.lineThickness;
    var cy = ((startY + endY) / 2) - (thickness / 2);

    this.subElm('.line').css({
      'height':thickness,
      'left': cx,
      'top':cy,
      'width':(length),
      '-webkit-transform':'rotate(' + angle + 'deg)'
    });

    this.subElm('.fill').css({
      'width':(length - this.endElement.buttonRadius - this.elementRadius),
      'right':this.elementRadius
    });
  },


  shown: function() {
    var self = this;
    this.element.css({opacity:0});

    this.addTimeout('guidanceElement',function(){
      this.element.transition({
        opacity: 1,
        duration: 500,
        complete: function(){
          self.animateReady = true;
          self.subElm('.inner').css({
            'width':self.imageSize.width,
            'height':self.imageSize.width
          });
        }
      });

    },500);
  },

  hidden: function(){
    this.element.transition({opacity:0},300);
  }
});
