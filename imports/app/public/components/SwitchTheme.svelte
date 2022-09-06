<script>
import { onMount } from "svelte";

  import switchTeheme from "/lib/helper/switch-theme";

  onMount(()=>{
    let radioSwitchTheme = document.getElementById('radioSwitchTheme');
    if(localStorage.getItem('theme') == 'light') radioSwitchTheme.checked = true;
  });

  
</script>

<div class="form-check form-switch me-3">
  <input on:change={()=>{switchTeheme();}} id="radioSwitchTheme" class="form-check-input" type="checkbox">
</div>