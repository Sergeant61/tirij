<script>
  import { Meteor } from "meteor/meteor";
  import ErrorHandler from "/lib/utils/error-handler/client/error-handler.js";
  import { Loading } from "notiflix/build/notiflix-loading-aio";
  import { Notify } from "notiflix/build/notiflix-notify-aio";

  let currentUser;

  const handleSubmit = (event) => {
    event.preventDefault();

    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;

    const obj = {
      firstName: firstName,
      lastName: lastName,
    };

    Loading.hourglass();
    Meteor.call("user.updateProfile", obj, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      Notify.success("Success");
    });
  };

  $m: {
    currentUser = Meteor.user();
  }
</script>

<form on:submit={handleSubmit} class="brd-loading-section">
  {#if currentUser}
    <div class="form-floating">
      <input type="email" class="form-control brd-border-bottom-unset" id="emailAddress" value={currentUser.emails[0].address} disabled placeholder=" " />
      <label for="emailAddress">E-mail address</label>
    </div>

    <div class="form-floating">
      <input type="text" class="form-control brd-border-bottom-unset brd-border-top-unset" id="firstName" value={currentUser.profile.firstName} required placeholder=" " />
      <label for="firstName">Fist name</label>
    </div>

    <div class="form-floating">
      <input type="text" class="form-control brd-border-top-unset" id="lastName" value={currentUser.profile.lastName} required placeholder=" " />
      <label for="lastName">Last name</label>
    </div>

    <div class="d-grid gap-2 py-4">
      <button class="btn btn-outline-primary btn-lg" type="submit">OK</button>
    </div>
  {/if}
</form>
