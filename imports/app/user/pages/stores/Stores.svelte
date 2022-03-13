<script>
  import { Meteor } from "meteor/meteor";
  import { Loading } from "notiflix/build/notiflix-loading-aio";

  //* COMPONENTS
  import Navbar from "../../../public/components/Navbar.svelte";
  import Pagination from "../../../public/components/Pagination.svelte";
  import NavbarUser from "../../components/Navbar.svelte";
  import NotFound from "../../components/NotFound.svelte";

  //* MODALS
  import StoreCreate from "../../modals/store-create/StoreCreate.svelte";

  let stores = [],
    pagination = {
      currentPage: 1,
      pageItems: 10,
      totalCount: 0,
      totalPages: 0,
    };

  const getStores = () => {
    const currentPage = pagination.currentPage;
    const pageItems = pagination.pageItems;

    const obj = {
      options: {
        pagination: {
          currentPage: currentPage,
          pageItems: pageItems,
        },
      },
    };

    Loading.hourglass();
    Meteor.call("app.stores.list", obj, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      stores = result.data;
      pagination.currentPage = result.options.pagination.currentPage;
      pagination.pageItems = result.options.pagination.pageItems;
      pagination.totalCount = result.options.pagination.totalCount;
      pagination.totalPages = result.options.pagination.totalPages;
    });
  };
  getStores();

  const createdStore = () => {
    getStores();
  };
</script>

<Navbar />
<NavbarUser title="Stores" />
<div class="container py-3 d-flex gap-2 flex-fill flex-column">
  {#if stores.length > 0}
    <div class="flex-grow-0 d-flex justify-content-end pb-2">
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#brdStoreCreateModal"> <i class="fas fa-plus" /> Add Store</button>
    </div>

    <div class="flex-grow-1 overflow-auto">
      {#each stores as store (store._id)}
        <div class="rounded border border-primary shadow-sm py-3 px-2 position-relative mb-2">
          <span class="position-absolute bg-primary pe-2 h-100 start-0 top-0" />
          <div class="d-flex gap-2">
            <span class="ms-2 my-auto">{store.name}</span>

            <div class="d-flex flex-fill gap-2 justify-content-end">
              <a href="/user/store/{store.slug}/dashboard" class="btn btn-outline-success btn-sm">Choose</a>
            </div>

          </div>
        </div>
      {/each}
    </div>

    <div class="flex-grow-0">
      <Pagination {pagination} />
    </div>
  {:else}
    <NotFound title="Not found stores" addTitle="Add store" bsTarget="brdStoreCreateModal" />
  {/if}
</div>

<StoreCreate on:onCreatedStore={createdStore} />
