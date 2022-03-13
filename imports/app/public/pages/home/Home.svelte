<script>
  import { Meteor } from "meteor/meteor";
  import { Loading } from "notiflix/build/notiflix-loading-aio";
  import { Notify } from "notiflix/build/notiflix-notify-aio";

  //* STYLE
  import "./style.scss";

  //* COMPONENTS
  import Navbar from "../../components/Navbar.svelte";

  // UTILS
  let link = null,
    shortLinkDomain = Meteor.settings?.public?.shortLinkDomain || null;

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

      result.link1 = `${Meteor.absoluteUrl()}l/${result.shortId || result._id}`;
      if (shortLinkDomain) {
        result.link2 = `https://${shortLinkDomain}/${result.shortId || result._id}`;
      }

      link = result;
    });
  };

  const copy = (link) => {
    navigator.clipboard.writeText(link);
    Notify.success("Copied");
  };
</script>

<Navbar />
<div class="publicPageHome container-fluid py-3">
  <div class="bg-light p-lg-5 p-3 rounded mb-3">
    <h1>Shorten with Links</h1>
    <p class="lead">Shorten your long links for free with Links, and automate your applications as you wish with Api and Npm Modules.</p>
    <form on:submit={handleSubmit} id="brdFreeLinkCreate" class="d-flex gap-2 input-group-lg brd-form-focus-unset">
      <input type="text" class="form-control brd-free-input" placeholder="Write your long url" name="longUrl" aria-label="Long url" />
      <button class="btn btn-outline-secondary" type="submit">Create</button>
    </form>
    {#if link}
      <div class="mt-3 fs-5 brd-free-input">
        <div class="d-flex gap-2 justify-content-between mb-2">
          <a target="_blank" href={link.link1}>{link.link1}</a>
          <i class="far fa-copy brd-cursor-pointer" on:click={copy(link.link1)} />
        </div>
        {#if link.link2}
          <div class="d-flex gap-2 justify-content-between">
            <a target="_blank" href={link.link2}>{link.link2}</a>
            <i class="far fa-copy brd-cursor-pointer" on:click={copy(link.link2)} />
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <div class="d-flex justify-content-center align-items-center flex-wrap gap-4 mb-3">
    <div class="card shadow brd-zoom-in brd-card">
      <div class="card-body p-3">
        <h4>Use API</h4>
        <p>Automate the url shortening process in your applications using Api.</p>
      </div>
      <div class="card-body p-3">
        <a href="/api">Go Swagger</a>
      </div>
    </div>

    <div class="card shadow brd-zoom-in brd-card">
      <div class="card-body p-3">
        <h4>Npm Module</h4>
        <p>Automate the url shortening process in your applications using the Npm Module.</p>
      </div>
      <div class="card-body p-3">
        <a href="https://www.npmjs.com/package/links-api" target="_blank">Go Npm Module</a>
      </div>
    </div>
    
    <div class="card shadow brd-zoom-in brd-card">
      <div class="card-body p-3">
        <h4>Customize for your own use</h4>
        <p>Links is developed as open source. If you want, you can make a deployment for yourself.</p>
      </div>
      <div class="card-body p-3">
        <a href="https://github.com/Sergeant61/links" target="_blank">Go Github</a>
      </div>
    </div>
  </div>
</div>
