<script>
  import { active, router } from "tinro";
  import SwitchTheme from "./SwitchTheme.svelte";

  export let hideCollapseMenu;
  let user = null;

  const signOut = (event) => {
    event.preventDefault();

    Meteor.logout(function () {
      router.goto("/");
    });
  };

  $m: {
    user = Meteor.user();
  }
</script>

<nav class="navbar navbar-expand-sm navbar-light rounded-3 bg-light">
  <div class="container-fluid">
    <a href="/" class="tj-navbar-logo fs-2"></a>
    <!-- <a href="/"><img src="/assets/images/svelte-logo-horizontal.svg" alt="" height="50" class="d-inline-block align-text-top" /> </a> -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon" />
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      {#if hideCollapseMenu == true}
        {:else}
          <ul class="navbar-nav me-auto mb-2 mb-sm-0 ms-sm-3">
            <li class="nav-item">
              <a href="/api" class="nav-link" use:active active-class="fw-bold" aria-current="about">Api</a>
            </li>
            <li class="nav-item">
              <a href="https://github.com/Sergeant61/links" target="_blank" class="nav-link" active-class="fw-bold" aria-current="about">Github</a>
            </li>
            <li class="nav-item">
              <a href="https://www.npmjs.com/package/tirij-api" target="_blank" class="nav-link" active-class="fw-bold" aria-current="about">Npm Module</a>
            </li>
          </ul>
      {/if}

      <SwitchTheme />

      <div class="d-flex gap-2">
        {#if user}
          <a href="/users/profile" class="btn btn-primary">My Profile</a>
          <a on:click={signOut} href="/" class="btn btn-danger">Sign Out</a>
        {:else}
          <a href="/auth/sign-in" class="btn btn-primary">Sign In</a>
          <a href="/auth/sign-up" class="btn btn-secondary">Sign Up</a>
        {/if}
      </div>
    </div>
  </div>
  <hr class="mb-0">
</nav>
