MenuContainer = Component.create({
  name: 'menu-container',
  buttonsContainer: null,
  source: User.head,
  data: null,

  update: function(){

    var x = this.source.x - 1920/2;
    var y = this.source.y - 1080/2;

    this.buttonsContainer.element.css({left:x, top:y});

  },

  shown: function(){
    this.element.css({top:0});
  },

  hidden:function(){
    this.element.css({top:-1080});
  },

  proceed: function(items){

  },

  init: function(){
    var self = this;
    this.buttonsContainer = null;

    this.buttonsContainer = FourMenu.create({
      data: this.data,
      proceed: function(items){
        console.log("buttons container procced",items);
        self.proceed(items);
      },
    });

    this.addComponent(this.buttonsContainer);

  }
});
