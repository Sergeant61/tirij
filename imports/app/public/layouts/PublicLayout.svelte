<script>
  import { Route } from "tinro";

  //* PAGES
  import Home from "../pages/home/Home.svelte";
  import About from "../pages/about/About.svelte";
  import Contract from "../pages/contract/Contract.svelte";
  import To from "../pages/to/To.svelte";
  import Api from "../pages/api/Api.svelte";
  import NotFound from "../pages/not-found/NotFound.svelte";

</script>

<Route path="/"><Home /></Route>
<Route path="/to"><To /></Route>
<Route path="/about"><About /></Route>
<Route path="/contract"><Contract /></Route>
<Route path="/api"><Api /></Route>
<Route path="/error/not-found"><NotFound /></Route>
