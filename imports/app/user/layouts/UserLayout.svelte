<script>
  import { Route } from "tinro";

  //* PAGES
  import Dashboard from "../pages/dashboard/Dashboard.svelte";
  import Links from "../pages/links/Links.svelte";
</script>

<Route path="/dashboard"><Dashboard /></Route>
<Route path="/links"><Links /></Route>
