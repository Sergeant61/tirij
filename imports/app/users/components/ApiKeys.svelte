<script>
  import { Meteor } from "meteor/meteor";
  import ErrorHandler from "/lib/utils/error-handler/client/error-handler.js";
  import { Loading } from "notiflix/build/notiflix-loading-aio";
  import { Notify } from "notiflix/build/notiflix-notify-aio";

  let apiKey = null,
    apiKeys = [];

  const getApiKeys = (apiKey = {}) => {
    Loading.hourglass();
    Meteor.call("mor.apiKeys.list", {}, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      apiKeys = result.filter((_apiKey) => {
        return _apiKey._id !== apiKey._id;
      });
    });
  };
  getApiKeys();

  const createApiKey = () => {
    Loading.hourglass();
    Meteor.call("mor.apiKeys.create", {}, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      apiKey = result;
      getApiKeys(apiKey);
      Notify.success("Success");
    });
  };

  const deleteApiKey = (_id) => {
    Loading.hourglass();
    Meteor.call("mor.apiKeys.delete", _id, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      apiKey = null;
      getApiKeys();
      Notify.success("Success");
    });
  };

  const copy = (apiKey) => {
    Utility.copyText(`{"publicKey":"${apiKey.publicKey}", "secretKey":"${apiKey.secretKey}"}`);
    Notify.success("Success");
  };
</script>

<div class="d-flex flex-column gap-3">

  <div class="d-flex gap-3 justify-content-end alert alert-info" role="alert">
    <span>
      With Tirij Api, you can automate your application. Tirij uses Basic Auth to authenticate incoming requests. Api key consists of two parts, namely Public Key and Secret Key. <strong> Secret Key is displayed once during creation and encrypted by the system. </strong> The user who created the API keys has the authority.
    </span>
    <div class="my-auto">
      <button class="btn btn-primary" on:click={createApiKey}>Create</button>
    </div>
  </div>

  <div class="d-flex flex-column gap-3">
    {#if apiKey}
      <div class="d-flex justify-content-between bg-light rounded-3 p-2">
        <div class="my-auto">
          <span class="small d-block">Public Key: {apiKey.publicKey}</span>
          <span class="small">Secret Key: {apiKey.secretKey}</span>
        </div>
        <button class="btn btn-secondary" on:click={() => copy(apiKey)}><i class="far fa-copy fa-fw" /></button>
      </div>
    {/if}

    {#each apiKeys as apiKey (apiKey._id)}
      <div class="d-flex justify-content-between bg-light rounded-3 p-2">
        <div class="my-auto">
          <span class="small d-block">Public Key: {apiKey.publicKey}</span>
          <span class="small">Secret Key: *****{apiKey.secretKeyLastPrefix}</span>
        </div>
        <button class="btn btn-danger" on:click={() => deleteApiKey(apiKey._id)}><i class="far fa-trash-alt fa-fw" /></button>
      </div>
    {/each}
  </div>
</div>
