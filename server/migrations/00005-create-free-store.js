Migrations.add({
  version: 5,
  name: 'Free store created',
  up: function () {
    Stores.insert({ name: 'Free', description: 'Free links store' });
  }
});