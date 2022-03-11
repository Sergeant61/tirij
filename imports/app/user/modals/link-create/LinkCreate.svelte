<script>
  import { onMount, createEventDispatcher } from "svelte";

  import bootstrap from "bootstrap";
  import ErrorHandler from "/lib/utils/error-handler/client/error-handler.js";
  import { Loading } from "notiflix/build/notiflix-loading-aio";
  import LinkExpireType from "../../helpers/link-expire-type";

  let modalElement, modal, expireType;

  onMount(() => {
    modalElement = document.getElementById("brdLinkCreateModal");
    modal = new bootstrap.Modal(modalElement);

    modalElement.addEventListener("hidden.bs.modal", function (event) {});
  });

  const eventDispatcher = createEventDispatcher();

  const handleSubmit = (event) => {
    event.preventDefault();

    const longUrl = event.target.longUrl.value;
    const expireType = event.target.expireType.value;
    const expireAt = event.target.expireAt?.value;
    const maxClickCount = event.target.maxClickCount?.value;

    const obj = {
      link: {
        longUrl: longUrl,
        expireType: expireType,
      },
    };

    if (expireAt) {
      obj.link.expireAt = new Date(expireAt);
    }

    if (maxClickCount) {
      obj.link.clickCount = {
        max: parseInt(maxClickCount),
        count: 0,
      };
    }

    Loading.hourglass();
    Meteor.call("link.create", obj, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      eventDispatcher("onCreatedLink", result);
      modal.hide();
      event.target.reset();
    });
  };
</script>

<div class="modal" id="brdLinkCreateModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content py-1 brd-loading-modal">
      <div class="modal-header d-flex justify-content-center border-bottom-0">
        <h4 class="fw-bolder">Link Create</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
      </div>

      <div class="modal-body mx-md-2">
        <form on:submit={handleSubmit} id="brdLinkCreateForm">
          <div class="form-floating mb-2">
            <input type="text" class="form-control" id="brdLinkCreateModal_longUrl" name="longUrl" placeholder=" " required autocomplete="off" />
            <label for="brdLinkCreateModal_longUrl">Long Url</label>
          </div>

          <div class="form-floating mb-2">
            <select class="form-select" bind:value={expireType} id="brdLinkCreateModal_expireType" name="expireType" aria-label="Expire Type">
              {#each LinkExpireType() as expireType}
                <option value={expireType.value}>{expireType.text}</option>
              {/each}
            </select>
            <label for="brdLinkCreateModal_expireType">Expire Type</label>
          </div>

          {#if expireType == "count"}
            <div class="form-floating mb-2">
              <input type="number" class="form-control" id="brdLinkCreateModal_maxClickCount" name="maxClickCount" placeholder=" " autocomplete="off" />
              <label for="brdLinkCreateModal_maxClickCount">Max Click Count</label>
            </div>
          {/if}

          {#if expireType == "date"}
            <div class="form-floating mb-2">
              <input type="datetime-local" class="form-control" id="brdLinkCreateModal_expireAt" name="expireAt" placeholder=" " autocomplete="off" />
              <label for="brdLinkCreateModal_expireAt">Expire Date</label>
            </div>
          {/if}
        </form>
      </div>

      <div class="modal-footer border-top-0">
        <button type="submit" form="brdLinkCreateForm" class="btn btn-primary text-white">Create</button>
      </div>
    </div>
  </div>
</div>
