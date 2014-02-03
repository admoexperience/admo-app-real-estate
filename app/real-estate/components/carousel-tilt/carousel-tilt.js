CarouselTilt = Component.create({
  indexLeft: null,
  indexMiddle: null,
  indexRight: null,
  name: 'carousel-tilt',
  swipeReady: false,

  buttonAttr:{
    offset:{x:-200, y:250},
  },

  button: null,
  source: User.head,
  data: null,

  shown: function(){
    console.log(this.data);
    // set indexes
    this.indexLeft = this.data.items.length-1;
    this.indexMiddle = 0;
    this.indexRight = 1;

    // load middle div data
    var itemMiddle = this.data.items[this.indexMiddle];
    this.subElm('.middle .content').css({'background-image': 'url(' + this.data.items[0].image + ')'});
    this.subElm('.middle .container .price').text(itemMiddle.text);
    this.subElm('.middle .container .text').text(this.data.name);

    // load two side divs data
    this.preloadOffscreenDivs();

    this.element.css({top:0});
    var self = this;

    var r = setTimeout(function(){
      self.button.element.css({opacity:0});
      self.button.drawingReady = false;
      self.swipeReady = false;

      self.swipeTutorial();
    }, 1000);
  },

  update: function(){
    var x = this.source.x + this.buttonAttr.offset.x;
    var y = this.source.y + this.buttonAttr.offset.y;
    this.button.source = {x: x, y: y};

  },

  swipeCarousel: function(swipe){
    if(this.swipeReady){
      if(swipe == "SwipeToLeft"){
        this.slideIndex('left');
        this.slideItems('left');
      }
      else{
        this.slideIndex('right');
        this.slideItems('right');
      }
    }
  },

  slideIndex:function(direction){
    if(direction == 'right'){
      this.indexMiddle = this.indexMiddle-1;
    }
    else if(direction == 'left'){
      this.indexMiddle = this.indexMiddle+1;
    }

    if (this.indexMiddle < 0){
      this.indexMiddle = this.data.items.length-1;
    }
    if (this.indexMiddle == this.data.items.length){
      this.indexMiddle = 0;
    }

    this.indexLeft = this.indexMiddle-1;
    this.indexRight = this.indexMiddle+1;

    if (this.indexLeft < 0){
      this.indexLeft = this.data.items.length-1;
    }
    if (this.indexLeft == this.data.items.length){
      this.indexLeft = 0;
    }

    if (this.indexRight < 0){
      this.indexRight = this.data.items.length-1;
    }
    if (this.indexRight == this.data.items.length){
      this.indexRight = 0;
    }
  },

  slideItems: function(direction){
    var self = this;
    this.swipeReady = false;

    var leftDiv = this.subElm('.frame.left');;
    var midDiv = this.subElm('.frame.middle');
    var rightDiv = this.subElm('.frame.right');

    this.subElm('.frame').removeClass('left middle right');

    if(direction == 'right'){

      midDiv.addClass('animate');
      leftDiv.addClass('animate');

      rightDiv.addClass('left');
      midDiv.addClass('right');
      leftDiv.addClass('middle');

    }
    else if(direction == 'left'){

      midDiv.addClass('animate');
      rightDiv.addClass('animate');

      rightDiv.addClass('middle');
      midDiv.addClass('left');
      leftDiv.addClass('right');

    }

    var t = setTimeout(function(){
      self.subElm('.frame').removeClass('animate');

      var r = setTimeout(function(){
        self.swipeReady = true;
        self.subElm('.frame.middle .container').css({top:0});
        self.subElm('.frame.left .container').css({top:-500});
        self.subElm('.frame.right .container').css({top:-500});
        self.preloadOffscreenDivs();
      }, 1000);
    }, 1000);

  },

  swipeTutorial: function(){
    var self = this;

    this.subElm('.swipe-container .hand').css({left:1180});
    this.subElm('.swipe-container').transition({opacity:1},750, function(){
      self.subElm('.swipe-container .hand').transition({opacity:1},1000, function(){
        self.subElm('.swipe-container .hand').transition({left:520},1500, function(){

          self.subElm('.swipe-container').transition({opacity:0},500, function(){
            self.initComponent();
          });

        });
      });
    });

  },

  initComponent: function(){
    this.swipeReady = true;
    this.subElm('.frame.middle .container').css({top:0});
    this.button.element.css({opacity:1});
    this.button.drawingReady = true;
  },

  preloadOffscreenDivs:function(){
    var itemLeft = this.data.items[this.indexLeft];
    var itemRight = this.data.items[this.indexRight];

    this.subElm('.left .content').css({'background-image': 'url(' + itemLeft.image + ')'});
    this.subElm('.left .container .price').text(itemLeft.text);
    this.subElm('.left .container .text').text(this.data.name);


    this.subElm('.right .content').css({'background-image': 'url(' + itemRight.image + ')'});
    this.subElm('.right .container .price').text(itemRight.text);
    this.subElm('.right .container .text').text(this.data.name);
  },

  proceed:function(){

  },

  init: function(){
    var self = this;
    this.button = null;

    this.button = CircularButton.create({
      image: '/real-estate/images/5-content/back.png',
      circleClass:'circle-back',
      textClass:'text-start',
      text:'Back',
      source:{x:510 ,y:750},
      arcAttributes:{r:100, x:100, y:100, rotation:220, scope:360, max:280, thickness:20 , wallThickness:7},
      speed:3,

      dynamicPositioning:true,
      textOffset:{before:"0px,0px", after:"0px,70px", x:0, y:15},

      scale:0.65,
      scaleOffset:{x:336, y:378},

      proceed:function(){
        self.element.css({top:1080});

        var r = setTimeout(function(){
          self.proceed();
        }, 1000);
      },

    });

    this.addComponent(this.button);

  },


});
