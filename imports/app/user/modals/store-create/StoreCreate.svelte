<script>
  import { onMount, createEventDispatcher } from "svelte";

  import bootstrap from "bootstrap";
  import ErrorHandler from "/lib/utils/error-handler/client/error-handler.js";
  import { Loading } from "notiflix/build/notiflix-loading-aio";

  let modalElement, modal;

  onMount(() => {
    modalElement = document.getElementById("brdStoreCreateModal");
    modal = new bootstrap.Modal(modalElement);

    modalElement.addEventListener("hidden.bs.modal", function (event) {});
  });

  const eventDispatcher = createEventDispatcher();

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const description = event.target.description.value;

    const obj = {
      store: {
        name: name,
        description: description,
      },
    };

    Loading.hourglass();
    Meteor.call("app.stores.create", obj, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      eventDispatcher("onCreatedStore", result);
      modal.hide();
      event.target.reset();
    });
  };
</script>

<div class="modal" id="brdStoreCreateModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content py-1 brd-loading-modal">
      <div class="modal-header d-flex justify-content-center border-bottom-0">
        <h4 class="fw-bolder">Store Create</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
      </div>

      <div class="modal-body mx-md-2">
        <form on:submit={handleSubmit} id="brdStoreCreateForm">
          <div class="form-floating mb-2">
            <input type="text" class="form-control" id="brdStoreCreateModal_name" name="name" placeholder=" " required autocomplete="off" />
            <label for="brdStoreCreateModal_name">Name</label>
          </div>

          <div class="form-floating mb-2">
            <textarea type="text" class="form-control" id="brdStoreCreateModal_description" name="description" placeholder=" " style="height: 100px" autocomplete="off" />
            <label for="brdStoreCreateModal_description">Description</label>
          </div>

        </form>
      </div>

      <div class="modal-footer border-top-0">
        <button type="submit" form="brdStoreCreateForm" class="btn btn-primary text-white">Create</button>
      </div>
    </div>
  </div>
</div>
