<script>
  //* STYLE
//  import "./style.scss";

  //* COMPONENTS
  import Navbar from "../../../public/components/Navbar.svelte";
  import NavbarSub from "../../../public/components/NavbarSub.svelte";

  import Profile from "../../components/Profile.svelte";
  import Security from "../../components/Security.svelte";
  import ApiKeys from "../../components/ApiKeys.svelte";
  import Subscription from "../../components/Subscription.svelte";
</script>

<Navbar />
<div class="container userPageDashboard py-3">
  <div class="row">
    <NavbarSub title="Profile" />
    <div class="col-md-4 ps-md-0 mt-3">
      <div class="nav flex-column nav-pills text-nowrap" id="v-pills-tab" role="tablist" aria-orientation="vertical">
        <a class="nav-link active" id="v-pills-profile-tab" data-bs-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="true"><i class="far fa-address-card fa-fw me-1" /> Profile</a>
        <a class="nav-link" id="v-pills-security-tab" data-bs-toggle="pill" href="#v-pills-security" role="tab" aria-controls="v-pills-security" aria-selected="true"><i class="fas fa-shield-alt fa-fw me-1" /> Security</a>
        <a class="nav-link" id="v-pills-api-tab" data-bs-toggle="pill" href="#v-pills-api" role="tab" aria-controls="v-pills-api" aria-selected="true"><i class="fas fa-link fa-fw me-1" /> Api Keys</a>
        <a class="nav-link" id="v-pills-subscription-tab" data-bs-toggle="pill" href="#v-pills-subscription" role="tab" aria-controls="v-pills-subscription" aria-selected="false"><i class="far fa-credit-card fa-fw me-1" /> Subscription</a>
      </div>
    </div>

    <div class="col-md-8 pe-md-0 mt-3">
      <div class="tab-content flex-fill bg-white p-3 rounded-3" id="v-pills-tabContent">
        <div class="tab-pane fade show active" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
          <Profile />
        </div>

        <div class="tab-pane fade" id="v-pills-security" role="tabpanel" aria-labelledby="v-pills-security-tab">
          <Security />
        </div>

        <div class="tab-pane fade" id="v-pills-api" role="tabpanel" aria-labelledby="v-pills-api-tab">
          <ApiKeys />
        </div>
        <!-- 
        <div class="tab-pane fade" id="v-pills-subscription" role="tabpanel" aria-labelledby="v-pills-subscription-tab">
          <Subscription />
        </div>        -->
      </div>
    </div>
  </div>
</div>
