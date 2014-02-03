StartContainer = Component.create({
  name: 'start-container',
  button:null,

  shown: function(){
    var self = this;

    this.addTimeout('initTut',function(){
      self.rightHandIdentifier.drawArc();
      self.leftHandIdentifier.drawArc();
    },500);
  },

  hidden: function(){
    this.element.css({top:-1080});
  },

  proceed: function(){

  },

  animateTitle: function(){
    this.subElm('.welcome-title').css({top:200, left: 75, width:800});
  },

  init: function(){
    var self = this;
    this.button = null;

    this.button = CircularButton.create({
      circleClass:'circle-default',
      image: '/real-estate/images/3-start/hand-button.png',
      textClass:'text-start',
      text:'Start',
      source:{x:2500 ,y:540},
      arcAttributes:{r:175, x:100, y:100, rotation:220, scope:360, max:280, thickness:30 , wallThickness:10},
      speed:3,

      dynamicPositioning:false,
      //textOffset:{before:"0px,0px", after:"0px,70px", x:0, y:15},

      proceed:function(){
        this.setPosition({x:2500,y:540});

        self.proceed();
      },

    });

    this.rightHandIdentifier = CircularIdentifier.create({
      source: User.hands.right,
      proceed:function(){
        self.button.setPosition({x:1350,y:540});
        self.animateTitle();
      },
    });

    this.leftHandIdentifier = CircularIdentifier.create({
      source: User.hands.left,
      direction:'left',
    });

    this.addComponent(this.button);
    this.addComponent(this.rightHandIdentifier);
    this.addComponent(this.leftHandIdentifier);

  },

});
