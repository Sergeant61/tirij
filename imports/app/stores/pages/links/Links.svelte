<script>
  import { Meteor } from "meteor/meteor";
  import { Loading } from "notiflix/build/notiflix-loading-aio";
  import { Confirm } from "notiflix/build/notiflix-confirm-aio";
  import { meta } from "tinro";
  import { Notify } from "notiflix/build/notiflix-notify-aio";

  //* STYLE
//  import "./style.scss";

  //* COMPONENTS
  import ControlMenu from "../../../public/components/ControlMenu.svelte";
  import Navbar from "../../../public/components/Navbar.svelte";
  import Pagination from "../../../public/components/Pagination.svelte";
  import NavbarSub from "../../../public/components/NavbarSub.svelte";
  import NotFound from "../../../public/components/NotFound.svelte";

  //* MODALS
  import LinkCreate from "../../modals/link-create/LinkCreate.svelte";

  //* HELPERS
  import LinkExpireType from "../../helpers/link-expire-type";
  import Utility from "../../../../../lib/utils/utility/utility";
  import { QRUtil } from "../../../../../lib/utils/qr-util/index";
  import formatDateTime from "../../../../../lib/helper/format-date-time.js";
  import truncate from "../../../../../lib/helper/truncate";

  const slug = meta().params?.slug || null;

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

  const copy = (link) => {
    Utility.copyText(link);
    Notify.success("Success");
  };

  const downloadSvgQr = async (link) => {
    const result = await QRUtil.generateQr(link);
    Utility.downloadString("qr.svg", result);
  };

  const downloadPngQr = async (link) => {
    const result = await QRUtil.generateQr(link, { type: "png" });
    Utility.downloadUrl("qr.png", result);
  };

  const toggleAccordionItem = (linkId) => {
    links = links.map((link) => {
      if (link._id == linkId && !link.accordionItem) {
        link.accordionItem = true;
      } else {
        link.accordionItem = false;
      }

      return link;
    });
  };
</script>

<Navbar />
<NavbarSub title="Links" />

<div class="container py-3 d-flex flex-fill flex-column">
  {#if links.length > 0}
    <div class="flex-grow-0 d-flex justify-content-end pb-2">
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#brdLinkCreateModal"> <i class="fas fa-plus" /> Add Link</button>
    </div>

    <div class="flex-grow-1 overflow-auto">
      <table class="table table-striped">
        <thead>
          <tr>
            <th class="brd-rounded-start">Short Id</th>
            <th class="text-center">Expire Type</th>
            <th>Expire Date</th>
            <th class="text-center">Click Max/Count</th>
            <th class="brd-rounded-end text-end">#</th>
          </tr>
        </thead>
        <tbody class="accordion" id="brdPermissionAccordion">
          {#each links as link, index (link._id)}
            <tr class="align-middle">
              <th>
                <div class="d-flex gap-2 align-items-center">
                  <button class="btn btn-secondary rounded-pill accordion-item" on:click={() => toggleAccordionItem(link._id)} data-bs-toggle="collapse" data-bs-target="#collapseOne_{index}" aria-expanded="false" aria-controls="collapseOne_{index}">
                    {#if link.accordionItem}
                      <i class="fas fa-arrow-alt-circle-up" />
                    {:else}
                      <i class="fas fa-arrow-alt-circle-down" />
                    {/if}
                  </button>
                  {link._id}
                </div>
              </th>
              <td class="text-center">{LinkExpireType(link.expireType).text}</td>
              <td>{formatDateTime(link.expireAt)}</td>
              <td class="text-center">{link?.clickCount?.max || "-"} / {link?.clickCount?.count || 0} </td>
              <td>
                <ControlMenu scope={slug} deleteRole="permissions.links.delete" on:delete={() => deleteLink(link._id)} />
              </td>
            </tr>

            <tr>
              <td class="p-0" colspan="5">
                <div id="collapseOne_{index}" class="accordion-collapse collapse border-0" data-bs-parent="#brdPermissionAccordion">
                  <div class="accordion-body py-3 px-2">
                    <div class="shadow">
                      {#each link.shortLinks as shortLink}
                        <div class="d-flex gap-2 justify-content-between bg-white rounded-3 p-2">
                          <a class="my-auto small" target="_blank" href={shortLink}>{truncate(shortLink, 50)}</a>
                          <div class="d-flex gap-3">
                            <img on:click|preventDefault={() => copy(shortLink)} class="brd-cursor-pointer brd-download-img" src="/assets/svg/copy.svg" alt="link copy" />
                            <img on:click|preventDefault={() => downloadSvgQr(shortLink)} class="brd-cursor-pointer brd-download-img" src="/assets/svg/svg.svg" alt="svg download" />
                            <img on:click|preventDefault={() => downloadPngQr(shortLink)} class="brd-cursor-pointer brd-download-img" src="/assets/svg/png.svg" alt="png download" />
                          </div>
                        </div>
                      {/each}

                      {#each link.longLinks as longLink}
                        <div class="d-flex gap-2 justify-content-between bg-white rounded-3 p-2">
                          <a class="my-auto small" target="_blank" href={longLink}>{truncate(longLink, 50)}</a>
                          <div class="d-flex gap-3">
                            <img on:click|preventDefault={() => copy(longLink)} class="brd-cursor-pointer brd-download-img" src="/assets/svg/copy.svg" alt="link copy" />
                            <img on:click|preventDefault={() => downloadSvgQr(longLink)} class="brd-cursor-pointer brd-download-img" src="/assets/svg/svg.svg" alt="svg download" />
                            <img on:click|preventDefault={() => downloadPngQr(longLink)} class="brd-cursor-pointer brd-download-img" src="/assets/svg/png.svg" alt="png download" />
                          </div>
                        </div>
                      {/each}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="flex-grow-0">
      <Pagination {pagination} on:change={getLinks} />
    </div>
  {:else}
    <NotFound title="Not found links" addTitle="Add link" bsTarget="brdLinkCreateModal" />
  {/if}

  <LinkCreate on:onCreatedLink={getLinks} />
</div>
