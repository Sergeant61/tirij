<script>
  import { Meteor } from "meteor/meteor";
  import ErrorHandler from "/lib/utils/error-handler/client/error-handler.js";
  import { Loading } from "notiflix/build/notiflix-loading-aio";
  import { Notify } from "notiflix/build/notiflix-notify-aio";
  import { meta } from "tinro";

  let domainAddress,
    serverIp,
    domains = [];
  const slug = meta().params?.slug || null;

  const getDomains = () => {
    const obj = {
      slug: slug,
      options: {
        pagination: {
          currentPage: 1,
          pageItems: 10,
        },
      },
    };

    Loading.hourglass();
    Meteor.call("app.domains.list", obj, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      domains = result.data;
      serverIp = result.serverIp;
    });
  };
  getDomains();

  const createDomain = () => {
    Loading.hourglass();
    Meteor.call("app.domains.create", { slug: slug, domain: { host: domainAddress } }, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      getDomains();
      Notify.success("Success");
    });
  };

  const deleteDomain = (_id) => {
    Loading.hourglass();
    Meteor.call("app.domains.delete", { slug: slug, _id: _id }, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      domain = null;
      getDomains();
      Notify.success("Success");
    });
  };
</script>

<div class="d-flex flex-column gap-3">
  <div class="d-flex gap-3 flex-column alert alert-info" role="alert">
    <span>In order for the custom domain name to work, you must send it to the <strong>{serverIp || ""}</strong> ip address.</span>
    <div class="d-flex gap-3">
      <div class="form-floating w-100">
        <input type="text" class="form-control" id="domainAddress" bind:value={domainAddress} placeholder="meteor.com" />
        <label for="domainAddress">Domain</label>
      </div>

      <div class="my-auto">
        <button class="btn btn-primary" on:click={createDomain}>Create</button>
      </div>
    </div>
  </div>

  <div class="d-flex flex-column gap-3">
    {#each domains as domain (domain._id)}
      <div class="d-flex justify-content-between bg-light rounded-3 p-2">
        <div class="my-auto">
          <span class="small d-block">HOST: {domain.host}</span>
        </div>
        <button class="btn btn-danger" on:click={() => deleteDomain(domain._id)}><i class="far fa-trash-alt fa-fw" /></button>
      </div>
    {/each}
  </div>
</div>
