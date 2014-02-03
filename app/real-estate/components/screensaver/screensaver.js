Screensaver = Component.create({
  name: 'screensaver',
  swipeReady: false,

  shown: function(){
    this.element.css({opacity:1});
    this.loopItems();

  },

  update: function(){

  },

  fadeIn: function(){
    var self = this;
    $('.' + this.name).css({opacity:1});
  },

  fadeOut: function(){
    var self = this;
    $('.' + this.name).css({opacity:0});
  },

  showSilhouette: function(){

    var self = this;
    var fadeDiv = this.subElm('.fade-container .fade');
    var silhouetteDiv = this.subElm('.fade-container .silhouette');
    var textDiv = this.subElm('.fade-container .text');

    silhouetteDiv.removeClass('enlarge');
    textDiv.removeClass('shift-text');

    fadeDiv.animate({opacity:1}, 300, function(){
      textDiv.animate({opacity:1},300);
      silhouetteDiv.animate({opacity:1},300, function(){

        silhouetteDiv.addClass('enlarge');
        textDiv.addClass('shift-text');

        var t = setTimeout(function(){
          self.hideSilhouette();
        }, 2500);
      });
    });
  },

  hideSilhouette: function(){

    var self = this;
    var fadeDiv = this.subElm('.fade-container .fade');
    var silhouetteDiv = this.subElm('.fade-container .silhouette');
    var textDiv = this.subElm('.fade-container .text');

    textDiv.animate({opacity:0},300);
    silhouetteDiv.animate({opacity:0},300, function(){
      fadeDiv.animate({opacity:0},300, function(){
        self.loopItems();
      });
    });

  },


  swipeCarousel: function(swipe){
    if(this.swipeReady){
      if(swipe == "SwipeToLeft"){
        this.slideItems('left');
      }
      else{
        this.slideItems('right');
      }
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

      var t = setTimeout(function(){
        self.showSilhouette();

      }, 500);
    }, 1000);

    //this.preloadOffscreenDivs();
  },

  loopItems: function(){
    var self = this;
    var t = setTimeout(function(){
      self.slideItems('left');
    }, 6000);
  },


});
