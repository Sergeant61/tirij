<script>
  import { Route } from "tinro";

  //* LAYOUT
  import UserLayout from "./layouts/UserLayout.svelte";
</script>

<Route path="/users/*">
  <UserLayout />
</Route>
