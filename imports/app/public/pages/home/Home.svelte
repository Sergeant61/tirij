<script>
  import { Meteor } from "meteor/meteor";
  import { Loading } from "notiflix/build/notiflix-loading-aio";
  import { Notify } from "notiflix/build/notiflix-notify-aio";

  //* STYLE
  import "./style.scss";

  //* COMPONENTS
  import Navbar from "../../components/Navbar.svelte";
  import Footer from "../../components/Footer.svelte";

  //* HELPERS
  import Utility from "../../../../../lib/utils/utility/utility";
  import { QRUtil } from "../../../../../lib/utils/qr-util/index";

  // UTILS
  let link = null;

  const handleSubmit = (event) => {
    event.preventDefault();

    const longUrl = event.target.longUrl.value;

    if (!longUrl) {
      return;
    }

    const obj = {
      link: {
        longUrl: longUrl,
      },
    };

    Loading.hourglass();
    Meteor.call("app.links.createFree", obj, function (error, result) {
      Loading.remove();
      if (error) {
        ErrorHandler.show(error);
        return;
      }

      link = result;
    });
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
</script>

<Navbar />
<div class="publicPageHome d-flex flex-fill flex-column">
  <div class="flex-grow-0">
    <div class="bg-light px-lg-5 py-lg-4 p-3 mt-2">
      <h1>Shorten with Tirij</h1>
      <p class="lead">Shorten your long links for free with Tirij, and automate your applications as you wish with Api and Npm Modules.</p>
      <form on:submit={handleSubmit} id="brdFreeLinkCreate" class="d-flex gap-2 input-group-lg brd-form-focus-unset">
        <input type="text" class="form-control brd-free-input" placeholder="Write your long url" name="longUrl" aria-label="Long url" />
        <button class="btn btn-outline-secondary" type="submit">Create</button>
      </form>
      {#if link}
        <div class="mt-3 fs-5 brd-free-input">
          {#each link.shortLinks as shortLink}
            <div class="d-flex gap-2 bg-white rounded-3 p-2 justify-content-between mb-2">
              <a class="my-auto small" target="_blank" href={shortLink}>{shortLink}</a>
              <div class="d-flex gap-3 py-1">
                <img on:click|preventDefault={() => copy(shortLink)} class="brd-cursor-pointer brd-download-img" src="/assets/svg/copy.svg" alt="link copy" />
                <img on:click|preventDefault={() => downloadSvgQr(shortLink)} class="brd-cursor-pointer brd-download-img" src="/assets/svg/svg.svg" alt="svg download" />
                <img on:click|preventDefault={() => downloadPngQr(shortLink)} class="brd-cursor-pointer brd-download-img" src="/assets/svg/png.svg" alt="png download" />
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <div class="flex-grow-1">
    <div class="px-lg-5 py-lg-4 p-3 my-2 bg-light">
      <h3 class="text-decoration-underline">Plans</h3>

      <div class="d-flex justify-content-center align-items-center flex-wrap gap-4">
        <div class="card shadow brd-zoom-in brd-card">
          <div class="card-header position-relative overflow-hidden">
            <span class="fw-bold">FREE (0$/M)</span>
            <div class="position-absolute bg-info" style="top: -30px;right: -85px;color: white;padding: 40px 92px 6px;overflow: hidden;transform: rotate(23deg);font-size: 10px;font-weight: 800;">Hobi</div>
          </div>

          <div class="card-body p-3">
            <table class="table table-striped">
              <tbody>
                <tr>
                  <td>Ads</td>
                  <td> <i class="far fa-check-circle fa-lg" /></td>
                </tr>
                <tr>
                  <td>Link limit</td>
                  <td> <i class="fas fa-minus fa-lg" /></td>
                </tr>
                <tr>
                  <td>Custom link</td>
                  <td> <i class="fas fa-minus fa-lg" /></td>
                </tr>
                <tr>
                  <td>Custom domain</td>
                  <td> <i class="fas fa-minus fa-lg" /></td>
                </tr>
                <tr>
                  <td>Api access</td>
                  <td><i class="far fa-check-circle fa-lg" /></td>
                </tr>
                <tr>
                  <td>Npm module</td>
                  <td><i class="far fa-check-circle fa-lg" /></td>
                </tr>
                <tr>
                  <td>Qr code</td>
                  <td><i class="far fa-check-circle fa-lg" /></td>
                </tr>
                <tr>
                  <td>Customize Qr code</td>
                  <td><i class="fas fa-minus fa-lg" /></td>
                </tr>
              </tbody>
            </table>

            <p class="small">You can shorten unlimited links, advertisements will be displayed before the shortened links are redirected.</p>
          </div>

          <div class="card-body p-3">
            <a href="/auth/sign-up?plan=free">Sign Up</a>
          </div>
        </div>

        <div class="card shadow brd-zoom-in hover brd-card">
          <div class="card-header position-relative overflow-hidden">
            <span class="fw-bold">BASIC (2$/M)</span>
            <div class="position-absolute bg-success" style="top: -30px;right: -85px;color: white;padding: 40px 92px 6px;overflow: hidden;transform: rotate(23deg);font-size: 10px;font-weight: 800;">Popular</div>
          </div>

          <div class="card-body p-3">
            <table class="table table-striped">
              <tbody>
                <tr>
                  <td>Ads</td>
                  <td> <i class="far fa-check-circle fa-lg" /></td>
                </tr>
                <tr>
                  <td>Link limit</td>
                  <td> 1000 </td>
                </tr>
                <tr>
                  <td>Custom link</td>
                  <td> <i class="far fa-check-circle fa-lg" /></td>
                </tr>
                <tr>
                  <td>Custom domain</td>
                  <td> <i class="fas fa-minus fa-lg" /></td>
                </tr>
                <tr>
                  <td>Api access</td>
                  <td><i class="far fa-check-circle fa-lg" /></td>
                </tr>
                <tr>
                  <td>Npm module</td>
                  <td><i class="far fa-check-circle fa-lg" /></td>
                </tr>
                <tr>
                  <td>Qr code</td>
                  <td><i class="far fa-check-circle fa-lg" /></td>
                </tr>
                <tr>
                  <td>Customize Qr code</td>
                  <td><i class="far fa-check-circle fa-lg" /></td>
                </tr>
              </tbody>
            </table>

            <p class="small">You can shorten unlimited links, ads will be shown after our limit is reached before the shortened links are redirected.</p>
          </div>

          <div class="card-body p-3">
            <a href="/auth/sign-up?plan=basic">Sign Up</a>
          </div>
        </div>

        <div class="card shadow brd-zoom-in brd-card">
          <div class="card-header position-relative overflow-hidden">
            <span class="fw-bold">PRO (10$/M)</span>
            <div class="position-absolute bg-primary" style="top: -30px;right: -85px;color: white;padding: 40px 92px 6px;overflow: hidden;transform: rotate(23deg);font-size: 10px;font-weight: 800;">Best</div>
          </div>

          <div class="card-body p-3">
            <table class="table table-striped">
              <tbody>
                <tr>
                  <td>Ads</td>
                  <td><i class="fas fa-minus fa-lg" /> </td>
                </tr>
                <tr>
                  <td>Link limit</td>
                  <td><i class="fas fa-minus fa-lg" /> </td>
                </tr>
                <tr>
                  <td>Custom link</td>
                  <td><i class="far fa-check-circle fa-lg" /></td>
                </tr>
                <tr>
                  <td>Custom domain</td>
                  <td>Soon</td>
                </tr>
                <tr>
                  <td>Api access</td>
                  <td><i class="far fa-check-circle fa-lg" /></td>
                </tr>
                <tr>
                  <td>Npm module</td>
                  <td><i class="far fa-check-circle fa-lg" /></td>
                </tr>
                <tr>
                  <td>Qr code</td>
                  <td><i class="far fa-check-circle fa-lg" /></td>
                </tr>
                <tr>
                  <td>Customize Qr code</td>
                  <td><i class="far fa-check-circle fa-lg" /></td>
                </tr>
              </tbody>
            </table>

            <p class="small">You can shorten unlimited links, shortened links will be redirected directly. And you can use it with many more features.</p>
          </div>

          <div class="card-body p-3">
            <a href="/auth/sign-up?plan=pro">Sign Up</a>
          </div>
        </div>
      </div>
    </div>

    <div class="px-lg-5 py-lg-4 p-3 my-2 bg-light">
      <h3 class="text-decoration-underline">Features</h3>
      <div class="d-flex justify-content-center align-items-center flex-wrap gap-4">
        <div class="card shadow brd-zoom-in brd-card">
          <div class="card-body p-3">
            <h4>Use API</h4>
            <p class="small">Automate the url shortening process in your applications using Api.</p>
          </div>
          <div class="card-body p-3">
            <a href="/api">Go Swagger</a>
          </div>
        </div>

        <div class="card shadow brd-zoom-in brd-card">
          <div class="card-body p-3">
            <h4>Npm Module</h4>
            <p class="small">Automate the url shortening process in your applications using the Npm Module.</p>
          </div>
          <div class="card-body p-3">
            <a href="https://www.npmjs.com/package/links-api" target="_blank">Go Npm Module</a>
          </div>
        </div>

        <div class="card shadow brd-zoom-in brd-card">
          <div class="card-body p-3">
            <h4>Customize for you</h4>
            <p class="small">Tirij is developed as open source. If you want, you can make a deployment for yourself.</p>
          </div>
          <div class="card-body p-3">
            <a href="https://github.com/Sergeant61/links" target="_blank">Go Github</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex-grow-0">
    <Footer />
  </div>
</div>
