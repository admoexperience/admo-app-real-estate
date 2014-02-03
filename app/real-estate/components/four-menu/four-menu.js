FourMenu = Component.create({
  name: 'four-menu',
  buttons: [],
  source: User.head,

  buttonAttr:[{
    source:{x:510 ,y:1090},
    offset:{x:-450, y:550},
  },
  {
    source:{x:610 ,y:690},
    offset:{x:-350, y:150},
  },
  {
    source:{x:1310 ,y:690},
    offset:{x:350, y:150},
  },
  {
    source:{x:1410 ,y:1090},
    offset:{x:450, y:550},
  }],

  update: function(){
    for(var i=0 ; i< this.buttonAttr.length ; i++){
      var x = this.source.x + this.buttonAttr[i].offset.x;
      var y = this.source.y + this.buttonAttr[i].offset.y;

      if(this.buttons[i].drawingReady) {
        this.buttons[i].source = {x: x, y: y};
      }
    }
  },

  proceedNext:function(){
    var self = this;

    for(var i=0 ; i< this.buttonAttr.length ; i++){
      this.buttons[i].drawingReady = false;
      if(i<2)
        this.buttons[i].element.css({left:-1000});
      else
        this.buttons[i].element.css({left:1000});
    }

    this.element.css({top:-500});

    this.addTimeout("procceeding",function(){
      self.proceed(this.data[this.selectedItemIndex]);
    }, 500);
  },


  proceed: function(carouselData){

  },

  init: function(){
    var self = this;
    this.buttons = [];

    for(var i=0 ; i< this.buttonAttr.length ; i++){
      var button = CircularButton.create({
        index: i,
        text: this.data[i].name,
        image: this.data[i].image,
        circleClass: 'circle-' + i,
        textClass:'text-start',
        source:self.buttonAttr[i].source,
        arcAttributes:{r:150, x:100, y:100, rotation:220, scope:360, max:280, thickness:30 , wallThickness:10},
        speed:3,
        buttonID:i,

        dynamicPositioning:false,
        textOffset:{before:"0px,0px", after:"0px,70px", x:0, y:15},

        proceed:function(){
          self.selectedItemIndex = this.index;
          self.proceedNext();
        },

        loading:function(){
          if(this.buttonID == 0)
            self.buttons[1].element.css({top: -100});
          else if(this.buttonID == 1)
            self.buttons[0].element.css({top: 100});
          else if(this.buttonID == 2)
            self.buttons[3].element.css({top: 100});
          else if(this.buttonID == 3)
            self.buttons[2].element.css({top: -100});
        },

        unloading: function(){
          if(this.buttonID == 0)
            self.buttons[1].element.css({top: 0});
          else if(this.buttonID == 1)
            self.buttons[0].element.css({top: 0});
          else if(this.buttonID == 2)
            self.buttons[3].element.css({top: 0});
          else if(this.buttonID == 3)
            self.buttons[2].element.css({top: 0});
        },
      });

      this.buttons.push(button);
      this.addComponent(button);
    }
  }
});
