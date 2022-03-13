<script>
  export let title;
  export let bsTarget;
  export let addTitle;

</script>

<div class="d-flex justify-content-center">
  <div class="alert alert-info text-center " role="alert">
    <p>{title}</p>
    <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#{bsTarget}"> <i class="fas fa-plus" /> {addTitle}</button>
  </div>
</div>


<style>
  .alert-info {
    width: 500px;
  }
</style>