<script>
  import { Meteor } from "meteor/meteor";
  import ErrorHandler from "/lib/utils/error-handler/client/error-handler.js";
  import { Notify } from "notiflix/build/notiflix-notify-aio";
  import { Loading } from "notiflix/build/notiflix-loading-aio";

  let svgResult = null;
  let is2faAppReady = false,
    is2faEnabled = false;

  const has2faEnabled = () => {
    Loading.hourglass();
    Accounts.has2faEnabled(function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      is2faEnabled = result;
    });
  };
  has2faEnabled();

  const resetPassword = () => {
    const emailAddress = Meteor.user().emails[0].address;

    Loading.hourglass();
    Meteor.call("auth.forgotPassword", { email: emailAddress }, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      Notify.success("An e-mail has been sent to your e-mail address to reset your password");
    });
  };

  const enable2fa = () => {
    Loading.hourglass();
    Accounts.generate2faActivationQrCode(Meteor.absoluteUrl(), function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      svgResult = result;
    });
  };

  const disabled2fa = () => {
    Loading.hourglass();
    Accounts.disableUser2fa(function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      has2faEnabled();
    });
  };

  const registered = () => {
    is2faAppReady = true;
    svgResult = null;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const code = event.target.code.value;

    Loading.hourglass();
    Accounts.enableUser2fa(code, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      has2faEnabled();
      Notify.success("Success");
      svgResult = null;
      is2faAppReady = null;
    });
  };
</script>

<div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"> General </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <button class="btn btn-outline-primary" on:click|preventDefault={resetPassword}><i class="fas fa-key fa-fw" /> Reset Password</button>
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingTwo">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        {#if is2faEnabled}<i class="fas fa-check-circle fa-fw text-success me-1" />{:else}<i class="fas fa-times-circle fa-fw text-danger me-1" />{/if} 2FA Settings
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <div class="mb-2">
          {#if is2faEnabled}
            <button class="btn btn-primary" on:click|preventDefault={disabled2fa}><i class="fas fa-lock-open fa-fw" /> 2fa Disabled</button>
          {:else}
            <button class="btn btn-outline-primary" on:click|preventDefault={enable2fa}><i class="fas fa-lock fa-fw" /> 2fa Enabled</button>
          {/if}
        </div>

        <div class="d-flex flex-column">
          {#if svgResult}
            <div class="align-self-center mb-2">
              <div class="text-center">
                {@html svgResult.svg}
                <div class="fw-bold small mb-2">{svgResult.secret}</div>
              </div>

              <p>
                Register the following QR code or secret key with <a target="_blank" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2">Google Authenticator</a> or <a target="_blank" href="https://play.google.com/store/apps/details?id=com.agilebits.onepassword">1Password</a> applications.
              </p>

              <button class="btn btn-outline-primary btn-lg w-100" on:click|preventDefault={registered}>I registered</button>
            </div>
          {/if}

          {#if is2faAppReady}
            <form on:submit={handleSubmit} class="brd-loading-section">
              <p>Please enter the code in the application.</p>
              <div class="form-floating">
                <input type="text" class="form-control" id="code" required placeholder=" " />
                <label for="code">Code</label>
              </div>

              <div class="d-grid gap-2 py-4">
                <button class="btn btn-outline-primary btn-lg" type="submit">OK</button>
              </div>
            </form>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
