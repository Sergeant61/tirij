<script>
  import { Meteor } from "meteor/meteor";
  import { router } from "tinro";
  const to = router.location.query.get("to");

  const adPageDisplayTime = Meteor.settings.public?.adPageDisplayTime || 5000;

  let time = adPageDisplayTime / 1000;
  const id = setInterval(function () {
    time -= 1;
  }, 1000);

  setTimeout(function () {
    clearInterval(id);
    window.location.href = to;
  }, adPageDisplayTime);
</script>

<div class="countainer p-3">
  <p>You will be redirected after {time} seconds.</p>

  <div class="ads bg-light rounded-3 p-2">
    <h4>It is an advertising space.</h4>
  </div>
</div>

<style>
  .ads {
    width: 500px;
    height: 500px;
  }
</style>
