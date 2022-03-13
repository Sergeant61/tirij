Migrations.add({
  version: 4,
  name: 'Free store created',
  up: function () {
    Stores.insert({ name: 'Free', description: 'Free links store' });
  }
});