<script>
  import { Route } from "tinro";

  //* LAYOUT
  import StoreLayout from "./layouts/StoreLayout.svelte";
</script>

<Route path="/stores/*">
  <StoreLayout />
</Route>
