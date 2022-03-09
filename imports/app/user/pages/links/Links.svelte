<script>
  import { Meteor } from "meteor/meteor";
  import { Loading } from "notiflix/build/notiflix-loading-aio";
  import { router } from "tinro";
  import formatDateTime from "../../../../../lib/helper/format-date-time.js";

  //* COMPONENTS
  import Navbar from "../../../public/components/Navbar.svelte";
  import Pagination from "../../../public/components/Pagination.svelte";
  import NavbarUser from "../../components/Navbar.svelte";

  //* MODALS
  import LinkCreate from "../../modals/link-create/LinkCreate.svelte";

  //* HELPERS
  import LinkExpireType from "../../helpers/link-expire-type";

  let links = [],
    selectedLink,
    pagination = {
      currentPage: 1,
      pageItems: 10,
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
      console.log(links);
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
    <div class="d-flex justify-content-end pb-2">
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#brdLinkCreateModal"> <i class="fas fa-plus" /> Add Link</button>
    </div>

    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th class="brd-rounded-start">Short Link</th>
          <th class="text-center">Expire Type</th>
          <th>Expire Date</th>
          <th class="brd-rounded-end text-end">Click Max/Count</th>
        </tr>
      </thead>
      <tbody>
        {#each links as link (link._id)}
          <tr>
            <th> <a class="text-white" target="_blank" href="{Meteor.absoluteUrl()}l/{link.shortId || link._id}">{Meteor.absoluteUrl()}l/{link.shortId || link._id}</a> </th>
            <th class="text-center">{LinkExpireType(link.expireType).text}</th>
            <td>{formatDateTime(link.expireAt)}</td>
            <td class="text-end">{link?.clickCount?.max || "-"} / {link?.clickCount?.count || 0} </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <Pagination {pagination}/>
  {:else}
    <div class="d-flex justify-content-center">
      <div class="alert alert-info text-center " role="alert">
        <p>Sonuç bulunamadı</p>
        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#brdLinkCreateModal"> <i class="fas fa-plus" /> Add Link</button>
      </div>
    </div>
  {/if}

  <LinkCreate on:onCreatedLink={createdLink} />
</div>

<style>
  .alert-info {
    width: 500px;
  }

  .brd-rounded-start {
    border-radius: 10px 0px 0px 10px;
  }
  .brd-rounded-end {
    border-radius: 0px 10px 10px 0px;
  }
</style>
