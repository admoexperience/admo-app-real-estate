'use strict';

// load the data file
var imageURL = '/real-estate/images/content/';
var AppData = [];
$.getJSON('/real-estate/data/data.json', function(data) {
  for (var i=0; i<data.length; i++){
    var menu = data[i];
    menu.image = imageURL + "menu-" + (i+1) + "/icon.png";

    for(var j=0;j<menu.items.length;j++) {
      var item = menu.items[j];
      item.image =imageURL + "menu-" + (i+1) + "/item-" + (j+1) + ".jpg"
    }

    AppData.push(menu);
  }
});

AdmoApp.MainCtrl = function($scope) {
    console.log(AppData);
    //Global components that are shared across screens.
    //Careful care should be made to ONLY use these as needed
    //Generally this should only be used for consistent background elements

    var userVector = UserVector.create({
    });

    var backgroundPhoto = BackgroundPhoto.create({
    });

    var screensaver = Screensaver.create({
      fadeComplete: function(fade){
        trackingPlain.fadeComplete(fade);
      },
    });

    var backPlain = BackPlain.create({
    });

    var startContainer = StartContainer.create({

      proceed:function(){
        AdmoApp.setScreen(AdmoApp.Screens.menuScreen);
      },
    });

     var trackingPlain = TrackingPlain.create({

      optimalRadius: {x:150,z:350},

      inPosition:function(){
        AdmoApp.setScreen(AdmoApp.Screens.startScreen);
      },
      moveUp: function(){
        backPlain.moveUp();
      },
      moveDown: function(){
        backPlain.moveDown();
      },
      fadeIn: function(){
        screensaver.fadeIn();
        backPlain.hidePlain();
      },
      fadeOut: function(){
        screensaver.fadeOut();
        backPlain.showPlain();
      },
    });

    var globalComponents = GlobalComponents.create({
      components:[backgroundPhoto, backPlain, userVector]
    });


    AdmoApp.Screens.guidanceScreen = Screen.create({
      components:[trackingPlain, screensaver],
      shown: function(){
        userVector.hideSilhouette();
      }
    });

    AdmoApp.Screens.startScreen = Screen.create({
      components:[startContainer],
      shown: function(){
        userVector.scaleVector(1);
      }
    });

    /********** MENU SCREEN ***************/

    var menu = MenuContainer.create({
      data: AppData,
      proceed: function(carouselData){
        console.log("MenuContainer ", carouselData);
        carousel.data = carouselData;
        AdmoApp.setScreen(AdmoApp.Screens.carouselScreen);
      },
    });

    AdmoApp.Screens.menuScreen = Screen.create({
      components:[menu],
      shown: function(){
        backPlain.moveMenu();
        userVector.scaleVector(1);
      }
    });

    /********** CAROUSEL SCREEN ***************/

    var carousel = CarouselTilt.create({
      data: AppData,
      proceed:function(){
        AdmoApp.setScreen(AdmoApp.Screens.menuScreen);
      },
    });

    AdmoApp.Screens.carouselScreen = Screen.create({
      components:[carousel],
      shown: function(){
        userVector.scaleVector(0.65);
      }
    });

    /**********STATE SCREEN HANDLER***************/

    AdmoApp.stateChanged = function(oldState, newState) {
      if( oldState == 3 && (newState==2 || newState==1)){
        AdmoApp.setScreen(AdmoApp.Screens.guidanceScreen);
      }

      if (oldState == 3 && newState != 3){
        //User has gone out of view stop the users session
         Stats.endSession();
      }
    };

    AdmoApp.imageFrame = function(image) {

      userVector.drawVector(image);
    };
/*
    var x = AdmoApp.initAnimationLoop

    AdmoApp.initAnimationLoop = function(){
      x();
      TWEEN.update();
    };
*/
    AdmoApp.swipeGesture = function(swipeGesture) {
      carousel.swipeCarousel(swipeGesture);

    };

    /**********STATE SCREEN HANDLER***************/
    AdmoApp.setGlobalComponents(globalComponents);

    AdmoApp.init();

    //Init the AdmoApp
    AdmoApp.angularScope = $scope;

    //Set the default screen for the app (ie the starting screen.)
    AdmoApp.setScreen(AdmoApp.Screens.guidanceScreen);

};
