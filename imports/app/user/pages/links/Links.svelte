<script>
  import { Meteor } from "meteor/meteor";
  import { Loading } from "notiflix/build/notiflix-loading-aio";
  import { Confirm } from "notiflix/build/notiflix-confirm-aio";
  import { meta } from "tinro";
  import formatDateTime from "../../../../../lib/helper/format-date-time.js";

  //* COMPONENTS
  import Navbar from "../../../public/components/Navbar.svelte";
  import Pagination from "../../../public/components/Pagination.svelte";
  import NavbarUser from "../../components/Navbar.svelte";
  import NotFound from "../../components/NotFound.svelte";

  //* MODALS
  import LinkCreate from "../../modals/link-create/LinkCreate.svelte";

  //* HELPERS
  import LinkExpireType from "../../helpers/link-expire-type";

  const slug = meta().params?.slug || null;

  let links = [],
    shortLinkDomain = Meteor.settings?.public?.shortLinkDomain || null,
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

    if (!slug) {
      return;
    }

    const obj = {
      slug: slug,
      options: {
        pagination: {
          currentPage: currentPage,
          pageItems: pageItems,
        },
      },
    };

    Loading.hourglass();
    Meteor.call("app.links.list", obj, function (error, result) {
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

  const deleteLink = (_id) => {
    Confirm.show(
      "Links App",
      "Are you sure you want to delete?",
      "Yes",
      "No",
      () => {
        Meteor.call("app.links.delete", { slug: slug, _id: _id }, function (error, result) {
          Loading.remove();
          if (error) {
            ErrorHandler.show(error);
            return;
          }

          getLinks();
        });
      },
      () => {}
    );
  };
</script>

<Navbar />
<NavbarUser title="Links" />

<div class="container py-3 d-flex flex-fill flex-column">
  {#if links.length > 0}
    <div class="flex-grow-0 d-flex justify-content-end pb-2">
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#brdLinkCreateModal"> <i class="fas fa-plus" /> Add Link</button>
    </div>

    <div class="flex-grow-1 overflow-auto">
      <table class="table table-striped">
        <thead>
          <tr>
            <th class="brd-rounded-start">Short Link</th>
            <th class="text-center">Expire Type</th>
            <th>Expire Date</th>
            <th class="text-center">Click Max/Count</th>
            <th class="brd-rounded-end text-end">#</th>
          </tr>
        </thead>
        <tbody>
          {#each links as link (link._id)}
            <tr class="align-middle">
              <th>
                <a target="_blank" href="{Meteor.absoluteUrl()}l/{link.shortId || link._id}">{Meteor.absoluteUrl()}l/{link.shortId || link._id}</a>
                {#if shortLinkDomain}
                  <br />
                  <a target="_blank" href="https://{shortLinkDomain}/{link.shortId || link._id}">https://{shortLinkDomain}/{link.shortId || link._id}</a>
                {/if}
              </th>
              <th class="text-center">{LinkExpireType(link.expireType).text}</th>
              <td>{formatDateTime(link.expireAt)}</td>
              <td class="text-center">{link?.clickCount?.max || "-"} / {link?.clickCount?.count || 0} </td>
              <td class="text-end">
                <button class="btn btn-danger" on:click={deleteLink(link._id)}> <i class="fas fa-trash-alt" /> Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="flex-grow-0">
      <Pagination {pagination} />
    </div>
  {:else}
    <NotFound title="Not found links" addTitle="Add link" bsTarget="brdLinkCreateModal" />
  {/if}

  <LinkCreate on:onCreatedLink={createdLink} />
</div>

<style>
  .brd-rounded-start {
    border-radius: 10px 0px 0px 10px;
  }
  .brd-rounded-end {
    border-radius: 0px 10px 10px 0px;
  }
</style>
