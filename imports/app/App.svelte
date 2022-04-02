<script>
  //* LAYOUTS
  import PublicRoutes from "./public/PublicRoutes.svelte";
  import AuthRoutes from "./auth/AuthRoutes.svelte";
  import UserRoutes from "./users/UserRoutes.svelte";
  import StoreRoutes from "./stores/StoreRoutes.svelte";
</script>

<div id="app" class="vh-100 d-flex flex-column">
  <PublicRoutes />
  <AuthRoutes />
  <UserRoutes />
  <StoreRoutes />
</div>
