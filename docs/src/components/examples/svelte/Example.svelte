<!--
  PLACEHOLDER — example content owned by the maintainer.
  This proves the Svelte integration builds and hydrates.
-->
<script lang="ts">
  import { placeholder } from "@openpronoun/core";

  const value = placeholder();
</script>

<div style="padding: 1rem; border: 1px solid #444; border-radius: 8px">
  <p><strong>Svelte</strong> — via <code>@openpronoun/core</code>:</p>
  <p>
    Result: <code>{value}</code>
  </p>
</div>
