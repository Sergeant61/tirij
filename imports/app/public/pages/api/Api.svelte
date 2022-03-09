<script>
  import SwaggerUI from "swagger-ui";
  import "swagger-ui/dist/swagger-ui.css";
  import { Meteor } from "meteor/meteor";
  import { Loading } from "notiflix/build/notiflix-loading-aio";

  let apis = [];

  //* COMPONENTS
  import Navbar from "../../components/Navbar.svelte";

  Loading.hourglass();
  Meteor.call("references.apis.list", {}, function (error, result) {
    Loading.remove();
    if (error) {
      ErrorHandler.show(error);
      return;
    }

    console.log(result.apis);
    apis = result.apis;
  });

  const toHumanReadable = (str) => {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
      return str.toUpperCase();
    });
  };

  const showApi = (api) => {

    console.log(api);

    SwaggerUI({
      dom_id: "#brdAccountPageSwagger",
      spec: api.spec,
      docExpansion: "none",
    });
  };
</script>

<Navbar />

<div class="container">
  <div class="row">
    <div class="col-12 mt-3">
      <div class="d-flex gap-2 overflow-auto pb-2">
        {#each apis as api}
          <div class="border bg-white rounded-3 p-3 gap-3 text-center d-flex flex-fill flex-column justify-content-between position-relative">
            <i class="fas fa-code fa-fw fa-2x mx-auto py-3" />
            <div>
              <span class="d-block fw-bold">{toHumanReadable(api.name)}</span>
            </div>
            <button on:click={showApi(api)} class="btn btn-outline-primary text-nowrap stretched-link brd-api">Show</button>
          </div>
        {/each}
      </div>
    </div>

    <div class="col-12">
      <div id="brdAccountPageSwagger" />
    </div>
  </div>
</div>
