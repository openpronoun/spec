<script lang="ts">
  import { parse, format } from "@openpronoun/core";

  let input = "she/her, they/them";

  $: parsed = input ? parse(input) : null;
  $: short = parsed ? format(parsed) : "";
  $: expanded = parsed ? format(parsed, { form: "expanded" }) : "";
</script>

<div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; font-family: system-ui, sans-serif">
  <p style="margin: 0 0 8px; font-weight: 600">
    Svelte — <code>@openpronoun/core</code>
  </p>
  <input
    bind:value={input}
    placeholder="e.g. she/her, they/them"
    style="border: 1px solid #e2e8f0; border-radius: 4px; font-size: 14px; padding: 6px 10px; width: 100%; box-sizing: border-box"
  />
  {#if parsed}
    <dl style="font-size: 13px; margin: 10px 0 0">
      <div style="display: flex; gap: 8px; margin-bottom: 4px">
        <dt style="color: #718096; min-width: 80px">Short</dt>
        <dd style="margin: 0"><strong>{short}</strong></dd>
      </div>
      <div style="display: flex; gap: 8px; margin-bottom: 4px">
        <dt style="color: #718096; min-width: 80px">Expanded</dt>
        <dd style="margin: 0"><strong>{expanded}</strong></dd>
      </div>
      <div style="display: flex; gap: 8px">
        <dt style="color: #718096; min-width: 80px">Entries</dt>
        <dd style="margin: 0">{parsed.length}</dd>
      </div>
    </dl>
  {/if}
  {#if !parsed && input}
    <p style="color: #718096; font-size: 13px; margin: 8px 0 0">No pronouns recognized.</p>
  {/if}
</div>
