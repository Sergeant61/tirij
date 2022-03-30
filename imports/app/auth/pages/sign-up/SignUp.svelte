<script>
  import ErrorHandler from "/lib/utils/error-handler/client/error-handler.js";
  import { Loading } from "notiflix/build/notiflix-loading-aio";
  import { router, meta } from "tinro";

  const plan = meta().query.plan || "free";

  const handleSubmit = (event) => {
    event.preventDefault();

    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const emailAddress = event.target.emailAddress.value;
    const password = event.target.password.value;
    const passwordAgain = event.target.passwordAgain.value;
    const storeName = event.target.storeName.value;

    if (password != passwordAgain) {
      ErrorHandler.show({ reason: "The passwords you entered are not the same." });
      return;
    }

    const obj = {
      emailAddress: emailAddress,
      password: password,
      plan: plan,
      profile: {
        firstName: firstName,
        lastName: lastName,
      },
      store: {
        name: storeName,
      },
    };

    Loading.hourglass();
    Meteor.call("user.create", obj, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      console.log(result);

      const { token, when, userId } = result;
      localStorage.setItem("Meteor.loginToken", token);
      localStorage.setItem("Meteor.loginTokenExpires", new Date(when));
      localStorage.setItem("Meteor.userId", userId);

      const redirect = router.location.query.get("redirect");

      if (redirect) {
        router.goto(redirect);
      } else {
        router.goto("/");
      }
    });
  };
</script>

<div class="container-fluid bg-light">
  <div class="d-flex flex-column flex-fill align-items-center h-100">
    <div class="form-sign">
      <h1 class="fw-bolder display-3">Sign Up</h1>
      <p class="pb-3">Create a new account.</p>

      <form on:submit={handleSubmit} class="brd-loading-section">
        <div class="form-floating">
          <input type="text" class="form-control brd-border-bottom-unset" id="firstName" required placeholder=" " />
          <label for="firstName">Fist name</label>
        </div>

        <div class="form-floating">
          <input type="text" class="form-control brd-border-bottom-unset brd-border-top-unset" id="lastName" required placeholder=" " />
          <label for="lastName">Last name</label>
        </div>

        <div class="form-floating">
          <input type="text" class="form-control brd-border-bottom-unset brd-border-top-unset" id="storeName" required placeholder=" " />
          <label for="storeName">Store Name</label>
        </div>

        <div class="form-floating">
          <input type="email" class="form-control brd-border-bottom-unset brd-border-top-unset" id="emailAddress" required placeholder=" " />
          <label for="emailAddress">E-mail address</label>
        </div>

        <div class="form-floating">
          <input type="password" class="form-control brd-border-bottom-unset brd-border-top-unset" id="password" required autocomplete="off" placeholder=" " />
          <label for="password">Password</label>
        </div>

        <div class="form-floating">
          <input type="password" class="form-control brd-border-top-unset" id="passwordAgain" autocomplete="off" required placeholder=" " />
          <label for="passwordAgain">Password again</label>
        </div>

        <div class="d-grid gap-2 py-4">
          <button class="btn btn-outline-primary btn-lg" type="submit">Sign Up</button>
        </div>

        <div class="d-flex justify-content-between">
          <a href="/auth/sign-in" class="text-black-50 pt-3">Sign In</a>
        </div>
      </form>
    </div>
  </div>
</div>
