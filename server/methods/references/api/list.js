new ValidatedMethod({
  name: 'references.apis.list',
  validate: function() {},
  run: function () {
    
    this.unblock();
    return {
      apis: MORAPIProducts
    };
  }
});