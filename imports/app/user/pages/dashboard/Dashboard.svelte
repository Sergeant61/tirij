<script>
  import { Meteor } from "meteor/meteor";
  import { Loading } from "notiflix/build/notiflix-loading-aio";
  import { meta } from "tinro";

  //* STYLE
  import "./style.scss";

  //* COMPONENTS
  import Navbar from "../../../public/components/Navbar.svelte";
  import NavbarUser from "../../components/Navbar.svelte";

  let dashboardData = {
    shortenedUrls: {
      never: 0,
      date: 0,
      count: 0,
    },
  };

  const getDashboardData = () => {
    const slug = meta().params?.slug || null;

    if (!slug) {
      return;
    }

    const obj = {
      slug: slug,
    };

    Loading.hourglass();
    Meteor.call("app.dashboard.show", obj, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      dashboardData = result;
    });
  };
  getDashboardData();
</script>

<Navbar />
<NavbarUser title="Dashboard" />
<div class="container userPageDashboard py-3 d-flex flex-fill flex-column">
  <div class="d-flex justify-content-center align-items-center flex-wrap gap-3">
    <div class="card shadow brd-zoom-in brd-card">
      <div class="card-body p-3">
        <h4 class="mb-0 fw-bold">Shortened Urls</h4>
        <hr class="my-1" />
        <div class="row text-center">
          <div class="col-md-4">
            <span class="mb-1 d-block fw-bold">Never</span>
            <span class="mb-1 fs-2">{dashboardData.shortenedUrls.never}</span>
          </div>

          <div class="col-md-4">
            <span class="mb-1 d-block fw-bold">Date</span>
            <span class="mb-1 fs-2">{dashboardData.shortenedUrls.date}</span>
          </div>

          <div class="col-md-4">
            <span class="mb-1 d-block fw-bold">Count</span>
            <span class="mb-1 fs-2">{dashboardData.shortenedUrls.count}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
