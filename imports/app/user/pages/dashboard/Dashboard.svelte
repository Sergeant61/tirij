<script>
  import { Meteor } from "meteor/meteor";
  import { router } from "tinro";

  //* COMPONENTS
  import Navbar from "../../../public/components/Navbar.svelte";
  import NavbarUser from "../../components/Navbar.svelte";

  const signOut = (event) => {
    event.preventDefault();

    Meteor.logout(function () {
      router.goto("/");
    });
  };
</script>

<Navbar />
<NavbarUser title='Dashboard' />
