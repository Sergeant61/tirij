<script>
  import { Route } from "tinro";

  //* PAGES
  import Dashboard from "../pages/dashboard/Dashboard.svelte";
  import Stores from "../pages/stores/Stores.svelte";
  import Links from "../pages/links/Links.svelte";
</script>

<Route path="/stores"><Stores /></Route>

<Route path="/store/:slug/*">
  <Route path="/dashboard"><Dashboard /></Route>
  <Route path="/links"><Links /></Route>
</Route>
