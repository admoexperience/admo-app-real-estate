CircularButton = Component.create({
  name: 'circular-button',
  paper:null,

  containerColour: '#D0D2D3',
  shadowColour: '#000',
  loadingColour: '#24B8BC',

  drawingReady:false,
  drawingInit:false,

  loadAmount:0,

  loadingArc:null,
  containerArc:null,
  shadowArc:null,
  arcAttributes:{r:300, x:100, y:100, rotation:200, scope:360, max:320, thickness:40, wallThickness:10},
  speed:0.5,

  fadeTime:500,

  trigger: [User.hands.left, User.hands.right],
  deltaTrigger:{x:0, y:0},

  scale:1,
  scaleOffset:{x:0, y:0},

  // Allows you to offset from the default position. It's a hack, because the default position
  // shouldn't be so tightly coupled, but I can't refactor the entire component now - ig.
  positionDelta:{x:0, y:0},
  source:{x:960 ,y:540},

  size:500,
  wasActive: false,
  loadingReady:true,

  shadowAttr:{x:5, y:5, t:10},

  circleClass:'circle-default',
  textClass:'text-default',
  text:'default',

  //by default use radius of arc
  hoverRadius: null,

  textWidth:100,
  textHeight:100,
  textOffset:{before:"0px,0px", after:"0px,100px", x:0, y:25},

  showShadow: false,

  dynamicPositioning:false,
  //default
  increaseHoverRadius:1,

  shown: function() {

    // add styling classes
    this.subElm('.container .circle').addClass(this.circleClass);
    this.subElm('.title .content').addClass(this.textClass);

    var self = this;
    this.loadAmount = 0;
    this.increaseHoverRadius = 1;

    this.size = (this.arcAttributes.r + this.arcAttributes.thickness)*2;

    this.arcAttributes.x = this.size/2;
    this.arcAttributes.y = this.size/2;

    this.subElm('.size').css({width:this.size, height:this.size});

    this.textWidth = parseInt(this.subElm('.title .' + this.textClass).css('width'));
    this.textHeight = parseInt(this.subElm('.title .' + this.textClass).css('height'));

    if(this.text != 'default')
      this.subElm('.title .' + this.textClass).text(this.text);

    this.subElm('.container').css({
      left:this.source.x  - this.size/2 + this.positionDelta.x,
      top:this.source.y - this.size/2 + this.positionDelta.y
    });
    this.subElm('.title').css({
      left:this.source.x  - this.textWidth/2 + this.positionDelta.x,
      top:this.source.y - this.textHeight/2 + this.positionDelta.y + this.size/2 + this.textOffset.y
    });

    this.drawingReady = false;
    this.drawingInit = false;
    this.wasActive = false;
    this.loadingReady = true;
    this.initRaphael();

  },

  setPosition: function(source){

    this.source = source;
    this.subElm('.container').addClass('static-positioning');
    this.subElm('.title').addClass('static-positioning');

    this.subElm('.container').css({
      left:this.source.x  - this.size/2 + this.positionDelta.x,
      top:this.source.y - this.size/2 + this.positionDelta.y
    });
    this.subElm('.title').css({
      left:this.source.x  - this.textWidth/2 + this.positionDelta.x,
      top:this.source.y - this.textHeight/2 + this.positionDelta.y + this.size/2 + this.textOffset.y
    });

  },


  update: function() {
    if(this.dynamicPositioning){
      this.subElm('.container').css({
        left:this.source.x  - this.size/2 + this.positionDelta.x,
        top:this.source.y - this.size/2 + this.positionDelta.y
      });
      this.subElm('.title').css({
        left:this.source.x  - this.textWidth/2 + this.positionDelta.x,
        top:this.source.y - this.textHeight/2 + this.positionDelta.y + this.size/2 + this.textOffset.y
      });
    }

    if((this.drawingReady) && (this.drawingInit)){

      var hover= false;
      for(var i=0;i<this.trigger.length && !hover;i++){

        var trigger = this.trigger[i];
        var triggerX = trigger.x*this.scale + this.scaleOffset.x;
        var triggerY = trigger.y*this.scale + this.scaleOffset.y;

        hover = this.checkHover(triggerX, triggerY);
      }

      if(hover){
        this.increaseHoverRadius = 1.5;
      }
      else{
        this.increaseHoverRadius = 1;
      }

      this.executeHover(hover);


      this.drawCanvas();


    }

  },

  drawCanvas: function(){
    this.containerArc.attr({
      arc: [this.arcAttributes.x, this.arcAttributes.y, this.arcAttributes.max, this.arcAttributes.scope, this.arcAttributes.r]
    });

    if(this.showShadow){
      this.shadowArc.attr({
        arc: [this.arcAttributes.x- this.shadowAttr.x, this.arcAttributes.y- this.shadowAttr.y, this.arcAttributes.max, this.arcAttributes.scope, this.arcAttributes.r]
      });
    }

    this.loadingArc.attr({
      arc: [this.arcAttributes.x, this.arcAttributes.y, this.loadAmount, this.arcAttributes.scope,(this.arcAttributes.r)]
    });
  },

  checkHover: function(triggerX, triggerY){

    var hover = false;

    var diffX = this.source.x - (triggerX + this.deltaTrigger.x);
    var diffY = this.source.y - (triggerY + this.deltaTrigger.y);

    var diffRadius = Math.sqrt(diffX*diffX + diffY*diffY);

    var triggerRadius;

    if(this.hoverRadius){
      triggerRadius = this.hoverRadius;
    }
    else{
      triggerRadius = this.arcAttributes.r;
    }

    triggerRadius = triggerRadius * this.increaseHoverRadius;

    if(diffRadius < triggerRadius){
      hover = true;
    }
    else{
      hover = false;
    }

    return hover;

  },

  executeHover:function(hover){

    if(hover){
      this.loadingActive();
    }
    else{
      this.loadingDeactive();
    }
  },

  loadingActive: function(){
    var self = this;

    this.loadAmount = this.loadAmount + this.speed;

    if(this.loadAmount > this.arcAttributes.max){
        this.loadAmount = this.arcAttributes.max;
        this.subElm('.container .arc').animate({opacity:0},250);
        this.subElm('.title .' + this.textClass).css({'transform':'translate(' + this.textOffset.before +')'});
        this.subElm('.container').css({'transform':'scale(1)'});
        this.drawingReady = false;
        this.loadAmount = 0;
        this.unloading();
        this.wasActive = false;

        var t = setTimeout(function(){
          self.proceed();
        }, 250);
    }
    else if((this.wasActive == false)&&(this.loadingReady)){
      this.loadingReady = false;
      this.loading();
      this.subElm('.container').css({'transform':'scale(1.5)'});
      this.subElm('.title .' + this.textClass).css({'transform':'translate(' + this.textOffset.after +')'});
      this.subElm('.container .arc').animate({opacity:1},this.fadeTime,function(){
        self.loadingReady = true;
      });
      this.wasActive = true;
    }

  },

  loading: function(){

  },

  loadingDeactive: function(){
    var self = this;

    this.loadAmount = this.loadAmount - this.speed;

    if(this.loadAmount < 0){
        this.loadAmount = 0;
    }

    if((this.wasActive == true)&&(this.loadingReady)){
      this.loadingReady = false;
      this.unloading();
      this.subElm('.title .' + this.textClass).css({'transform':'translate(' + this.textOffset.before +')'});
      this.subElm('.container').css({'transform':'scale(1)'});
      this.subElm('.container .arc').animate({opacity:0},this.fadeTime,function(){
        self.loadingReady = true;
        self.unloadingDone();
      });
      this.wasActive = false;
    }
  },

  unloadingDone: function(){

  },

  unloading: function(){

  },

  proceed: function(){

  },


  initRaphael: function(){
    var self = this;
    this.drawingReady = false;

    var raphaelSVG = this.subElm('.container .arc');
    var svgWidth = parseInt(raphaelSVG.css('width'));
    var svgHeight = parseInt(raphaelSVG.css('height'));

    this.paper = new Raphael(raphaelSVG.get(0));

    //var archtype = Raphael("canvas", 200, 100);
    this.paper.customAttributes.arc = function (xloc, yloc, value, total, R) {
        var alpha = 360 / total * value,
            a = (90 - alpha) * Math.PI / 180,
            x = xloc + R * Math.cos(a),
            y = yloc - R * Math.sin(a),
            path;
        if (total == value) {
            path = [
                ["M", xloc, yloc - R],
                ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
            ];
        } else {
            path = [
                ["M", xloc, yloc - R],
                ["A", R, R, 0, +(alpha > 180), 1, x, y]
            ];
        }
        return {
            path: path
        };
    };

    if(this.showShadow){
      this.shadowArc = this.paper.path().attr({
          "stroke": this.shadowColour,
          "stroke-width": this.arcAttributes.thickness * 1.25,
          "stroke-linecap":"round",
          opacity:0.1,
          arc: [this.arcAttributes.x- 5, this.arcAttributes.y- 5, this.arcAttributes.max, this.arcAttributes.scope, this.arcAttributes.r]
      });
      this.shadowArc.rotate([this.arcAttributes.rotation, this.arcAttributes.x, this.arcAttributes.y]);
    }
    this.containerArc = this.paper.path().attr({
        "stroke": this.containerColour,
        "stroke-width": this.arcAttributes.thickness,
        "stroke-linecap":"round",
        arc: [this.arcAttributes.x, this.arcAttributes.y, this.arcAttributes.max, this.arcAttributes.scope, this.arcAttributes.r]
    });
    this.containerArc.rotate([this.arcAttributes.rotation, this.arcAttributes.x, this.arcAttributes.y]);

    this.loadingArc = this.paper.path().attr({
        "stroke": this.loadingColour,
        "stroke-width": (this.arcAttributes.thickness - this.arcAttributes.wallThickness),
        "stroke-linecap":"round",
        arc: [this.arcAttributes.x, this.arcAttributes.y, 0, this.arcAttributes.scope, (this.arcAttributes.r)]
    });
    this.loadingArc.rotate([this.arcAttributes.rotation, this.arcAttributes.x, this.arcAttributes.y]);



    this.addTimeout('raphael',function(){
      self.drawingInit = true;
      self.drawingReady = true;
    },500);
  },

  hidden: function(){

  },
});
