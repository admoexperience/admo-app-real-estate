BackPlain = Component.create({
  name: 'back-plain',

  removeClasses: function(){
    this.subElm('.dynamic-image').removeClass('move-down move-up hide-plain move-menu');
  },

  moveUp: function(){
    this.removeClasses();
    this.subElm('.dynamic-image').addClass('move-up');

    this.subElm('.title').removeClass('hide-text show-text');
    this.subElm('.title').addClass('show-text');
  },

  moveDown: function(){
    this.removeClasses();
    this.subElm('.dynamic-image').addClass('move-down');

    this.subElm('.title').removeClass('hide-text show-text');
    this.subElm('.title').addClass('hide-text');
  },

  hidePlain: function(){
    this.removeClasses();
    this.subElm('.dynamic-image').addClass('hide-plain');

    this.subElm('.title').removeClass('hide-text show-text');
    this.subElm('.title').addClass('hide-text');
  },

  showPlain: function(){
    this.removeClasses();
    this.subElm('.dynamic-image').addClass('move-up');

    this.subElm('.title').removeClass('hide-text show-text');
    this.subElm('.title').addClass('show-text');
  },

  moveMenu: function(){
    this.removeClasses();
    this.subElm('.dynamic-image').addClass('move-menu');

    this.subElm('.title').removeClass('hide-text show-text');
    this.subElm('.title').addClass('hide-text');
  },


});
