<script>
  import ErrorHandler from "/lib/utils/error-handler/client/error-handler.js";
  import SwalUtil from "/lib/utils/swal-util/client/swal-util.js";
  import { router } from "tinro";
  import { Loading } from "notiflix/build/notiflix-loading-aio";

  const handleSubmit = (event) => {
    event.preventDefault();

    const token = router.location.query.get("token");
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (!token) {
      ErrorHandler.show({ reason: "Reset key not found." });
      return;
    }

    if (password != confirmPassword) {
      ErrorHandler.show({ reason: "The passwords you entered are not the same." });
      return;
    }

    Loading.hourglass();
    Accounts.resetPassword(token, password, function (error) {
      Loading.remove();

      if (error) {
        ErrorHandler.show(error);
        return;
      }

      SwalUtil.show();
      router.goto("/");
    });
  };
</script>

<div class="authPageSetPassword container-fluid bg-light">
  <div class="d-flex flex-column flex-fill align-items-center h-100">
    <div class="form-sign">
      <h1 class="fw-bolder display-3">Set Password</h1>
      <p class="pb-3">New set password</p>

      <form on:submit={handleSubmit} class="brd-loading-section">
        <div class="form-floating">
          <input type="password" class="form-control brd-border-bottom-unset" id="password" autocomplete="off" placeholder=" " />
          <label for="password">Password</label>
        </div>

        <div class="form-floating">
          <input type="password" class="form-control brd-border-top-unset" id="confirmPassword" autocomplete="off" placeholder=" " />
          <label for="confirmPassword">Comfirm password</label>
        </div>

        <div class="d-grid gap-2 py-4">
          <button class="btn btn-outline-primary btn-lg" type="submit">OK</button>
        </div>

        <div class="d-flex justify-content-between">
          <a href="/auth/sign-in" class="text-black-50 pt-3">Sign In</a>
          <a href="/auth/sign-up" class="text-black-50 pt-3">Sign Up</a>
        </div>
      </form>
    </div>
  </div>
</div>
