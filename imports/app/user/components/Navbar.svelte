<script>
  import { Meteor } from "meteor/meteor";
  import { router, active } from "tinro";
  export let title;

  const signOut = (event) => {
    event.preventDefault();

    Meteor.logout(function () {
      router.goto("/");
    });
  };
</script>

<nav class="navbar navbar-expand-sm navbar-light bg-light">
  <div class="container-fluid">
    <span class="navbar-brand">{title}</span>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon" />
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="d-flex flex-fill justify-content-end navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" use:active aria-current="page" href="/user/dashboard">Dashboard</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" use:active aria-current="page" href="/user/links">Links</a>
        </li>
        <li class="nav-item">
          <a on:click={signOut} href="/" class="nav-link text-danger">Sign Out</a>
        </li>
      </ul>
    </div>
  </div>
</nav>