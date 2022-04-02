<script>
  import { createEventDispatcher } from "svelte";
  export let scope, readRole, updateRole, deleteRole, customEvents, data;

  // HELPERS
  import isInRole from "./../../../../lib/helper/is-in-role";

  const eventDispatcher = createEventDispatcher();

  const event = (type) => {
    eventDispatcher(type, data);
  };
</script>

<div class="h-100 d-flex align-items-center justify-content-end dropdown dropstart">
  <a href="#" class="link-dark" data-bs-toggle="dropdown"><i class="fas fa-ellipsis-v fa-fw text-brd-secondary-lighter-2" /></a>
  <ul class="dropdown-menu">
    {#if isInRole(readRole, scope)}
      <li><a class="dropdown-item" on:click|preventDefault={() => event("detail")} href="#"><i class="fas fa-info-circle fa-fw" /> Detail</a></li>
    {/if}

    {#if isInRole(updateRole, scope)}
      <li><a class="dropdown-item" on:click|preventDefault={() => event("update")} href="#"><i class="fas fa-edit fa-fw" /> Update</a></li>
    {/if}

    {#if isInRole(deleteRole, scope)}
      <li><a class="dropdown-item link-danger" on:click|preventDefault={() => event("delete")} href="#"><i class="fas fa-trash-alt fa-fw" /> Delete</a></li>
    {/if}

    {#if Array.isArray(customEvents)}
      {#each customEvents as customEvent}
        <li><a class="dropdown-item link-danger" on:click|preventDefault={() => event(customEvent.event)} href="#"> {#if customEvent.faIcon}<i class="{customEvent.faIcon} fa-fw" />{/if} {customEvent.title}</a></li>
      {/each}
    {/if}
  </ul>
</div>
