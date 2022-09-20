<script>
  import { Meteor } from "meteor/meteor";
  import { Loading } from "notiflix/build/notiflix-loading-aio";
  import { meta } from "tinro";

  //* STYLE
//  import "./style.scss";

  //* COMPONENTS
  import Navbar from "../../../public/components/Navbar.svelte";
  import NavbarSub from "../../../public/components/NavbarSub.svelte";
  import Domains from "../../components/Domains.svelte";
  import Dashboard from "../../components/dashboard/Dashboard.svelte";
</script>

<Navbar />
<NavbarSub title="Dashboard" />
<div class="container dashboardPageDashboard py-3 container">
  <div class="row">
    <div class="col-md-4">
      <div class="nav flex-column nav-pills text-nowrap p-2 border-end" id="v-pills-tab" role="tablist" aria-orientation="vertical">
        <a class="nav-link active" id="v-pills-dashboard-tab" data-bs-toggle="pill" href="#v-pills-dashboard" role="tab" aria-controls="v-pills-dashboard" aria-selected="true"><i class="far fa-address-card fa-fw me-1" />Dashboard</a>
        <a class="nav-link" id="v-pills-domains-tab" data-bs-toggle="pill" href="#v-pills-domains" role="tab" aria-controls="v-pills-domains" aria-selected="false"><i class="fas fa-network-wired fa-fw me-1" />Domians</a>
      </div>
    </div>

    <div class="col-md-8">
      <div class="tab-content flex-fill bg-white" id="v-pills-tabContent">
        <div class="tab-pane fade show active" id="v-pills-dashboard" role="tabpanel" aria-labelledby="v-pills-dashboard-tab">
          <Dashboard />
        </div>

        <div class="tab-pane fade" id="v-pills-domains" role="tabpanel" aria-labelledby="v-pills-domains-tab">
          <Domains />
        </div>
      </div>
    </div>
  </div>
</div>
