<script>
  import { Meteor } from "meteor/meteor";
  import { Loading } from "notiflix/build/notiflix-loading-aio";
  import { router } from "tinro";
  import formatDateTime from "../../../../../lib/helper/format-date-time.js";

  //* COMPONENTS
  import Navbar from "../../../public/components/Navbar.svelte";
  import NavbarUser from "../../components/Navbar.svelte";

  //* MODAL
  import LinkCreate from "../../modals/link-create/LinkCreate.svelte";

  let links = [],
    selectedLink,
    pagination = {
      currentPage: 1,
      pageItems: 2,
      totalCount: 0,
      totalPages: 0,
    };

  const getLinks = () => {
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
    Meteor.call("link.list", obj, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      links = result.data;
      pagination.currentPage = result.options.pagination.currentPage;
      pagination.pageItems = result.options.pagination.pageItems;
      pagination.totalCount = result.options.pagination.totalCount;
      pagination.totalPages = result.options.pagination.totalPages;
    });
  };

  getLinks();

  const createdLink = () => {
    getLinks();
  };
</script>

<Navbar />
<NavbarUser title="Links" />

<div class="container py-2">
  {#if links.length > 0}
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">First</th>
          <th scope="col">Last</th>
          <th scope="col">Handle</th>
        </tr>
      </thead>
      <tbody>
        {#each links as link (link._id)}
          <tr>
            <th>{link.expireType}</th>
            <td>{formatDateTime(link.expireAt)}</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div class="d-flex justify-content-center">
      <div class="alert alert-info text-center " role="alert">
        <p>Sonuç bulunamadı</p>
        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#brdLinkCreateModal"> <i class="fas fa-plus" /> Add Link</button>
      </div>
    </div>
  {/if}

  <LinkCreate on:onCreated={createdLink} />
</div>

<style>
  .alert-info {
    width: 500px;
  }
</style>
