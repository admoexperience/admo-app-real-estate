CircularIdentifier = Component.create({
  name: 'circular-identifier',

  paper:null,
  arcHand:null,
  lineHand:null,
  infoRect:null,
  arcAttributes:{colour:"#24B8BC",
                strokeEnd:"round",
                r:100,
                x:125,
                y:375,
                scope:360,
                max:360,
                thickness:15},

  source: User.hands.right,

  loadAmount:0,

  speed:4,

  direction:'right',



  shown: function(){

    this.drawingInit = false;
    this.initPaper();

    if(this.direction == 'right'){
      this.subElm('.text').css({opacity:1});
    }

  },

  update: function(){

    if(this.drawingInit){
      this.renderPaper();
    }

    this.containerTracker();

  },

  containerTracker: function(){

    var arcWidth = this.arcAttributes.r * 2 + 25*2;
    var containerWidth = parseInt(this.subElm('.container').css('width'));
    var containerHeight = parseInt(this.subElm('.container').css('height'));
    var left = this.source.x - arcWidth/2;
    var top = this.source.y - containerHeight + arcWidth/2;

    this.subElm('.container').css({left:left, top:top});

  },

  renderPaper: function(){

    this.arcHand.attr({
      arc: [this.arcAttributes.x, this.arcAttributes.y, this.loadAmount, this.arcAttributes.scope, this.arcAttributes.r]
    });

  },

  drawArc: function(){
    var self = this;

    var target = {x:this.arcAttributes.max, y:0};
    var position = {x:0, y:0};

    var tween = new TWEEN.Tween(position).to(target, 500);
    tween.start();

    tween.onUpdate(function(){
      self.loadAmount = position.x;
    });

    tween.onComplete(function(){
      if(self.direction == 'right'){
        self.drawLine();
      }
      else{
        self.addTimeout('eraseArc',function(){
          self.eraseArc();;
        },4000);
      }


    });

  },

  eraseArc: function(){
    var self = this;

    var target = {x:0, y:0};
    var position = {x:this.arcAttributes.max, y:0};

    var tween = new TWEEN.Tween(position).to(target, 500);
    tween.start();

    tween.onUpdate(function(){
      self.loadAmount = position.x;
    });

    tween.onComplete(function(){
      self.proceed();
    });

  },

  proceed: function(){

  },

  drawLine: function(){
    var self = this;

    var startPath = "M" + this.arcAttributes.x + "," + (this.arcAttributes.y - this.arcAttributes.r);

    var stage1 = startPath + "l0,-100";
    var stage2 = stage1 + "l50,-50";
    var stage3 = stage2 + "l50,0";
    var stage4 = stage3 + "l0,100 l0,-200";

    this.lineHand.attr({path:startPath});

    this.lineHand.animate({path:stage1}, 250, function(){
      self.lineHand.animate({path:stage2}, 200, function(){
        self.lineHand.animate({path:stage3}, 200, function(){
          self.lineHand.animate({path:stage4}, 200, function(){
            self.subElm('.text').transition({width:525},350);
            self.infoRect.animate({width:600}, 300, function(){
              self.addTimeout('erase',function(){
                self.eraseLine();
              },1500);
            });
          });
        });
      });
    });

  },

  eraseLine: function(){
    var self = this;

    var startPath = "M" + this.arcAttributes.x + "," + (this.arcAttributes.y - this.arcAttributes.r);

    var stage1 = startPath + "l0,-100";
    var stage2 = stage1 + "l50,-50";
    var stage3 = stage2 + "l50,0";
    var stage4 = stage3 + "l0,100 l0,-200";
    this.subElm('.text').transition({width:0},300);
    this.infoRect.animate({width:0}, 350, function(){
      self.lineHand.animate({path:stage3}, 250, function(){
        self.lineHand.animate({path:stage2}, 200, function(){
          self.lineHand.animate({path:stage1}, 200, function(){
            self.lineHand.animate({path:startPath}, 200, function(){
              self.eraseArc();
            });
          });
        });
      });
    });

  },

  initPaper: function()
  {
    var self = this;
    var raphaelSVG = this.subElm('.container .hand-arc');
    this.paper = Raphael(raphaelSVG.get(0));

    this.lineHand = this.paper.path("M-100 -100").attr({stroke:this.arcAttributes.colour,
                                                        "stroke-width":3});

    var rectX = this.arcAttributes.x + 100;
    var rectY = this.arcAttributes.y - this.arcAttributes.r - 250;
    var rectWidth = 0;
    var rectHeight = 200;

    this.infoRect = this.paper.rect(rectX, rectY, rectWidth, rectHeight).attr({fill:this.arcAttributes.colour,
                                                                        "stroke-width":0});

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

    this.arcHand = this.paper.path().attr({
        "stroke": this.arcAttributes.colour,
        "stroke-width": this.arcAttributes.thickness,
        arc: [this.arcAttributes.x, this.arcAttributes.y, 0, this.arcAttributes.scope, this.arcAttributes.r]
    });

    this.addTimeout('linesR',function(){
      self.drawingInit = true;
    },500);

  },


});
