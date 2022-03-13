<script>
  import { meta, active } from "tinro";
  export let title;
  let slug = meta().params?.slug || null;
</script>

<nav class="navbar navbar-expand-sm navbar-light bg-warning">
  <div class="container-fluid">
    <span class="navbar-brand">{title}</span>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon" />
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="d-flex flex-fill justify-content-end navbar-nav">
        {#if slug}
          <li class="nav-item">
            <a class="nav-link active" use:active aria-current="page" href="/user/store/{slug}/dashboard">Dashboard</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" use:active aria-current="page" href="/user/store/{slug}/links">Links</a>
          </li>
        {/if}
      </ul>
    </div>
  </div>
</nav>
