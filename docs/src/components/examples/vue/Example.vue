<script setup lang="ts">
import { ref, computed } from "vue";
import { parse, format } from "@openpronoun/core";

const input = ref("she/her, they/them");
const parsed = computed(() => (input.value ? parse(input.value) : null));
const short = computed(() => (parsed.value ? format(parsed.value) : ""));
const expanded = computed(() =>
  parsed.value ? format(parsed.value, { form: "expanded" }) : ""
);
</script>

<template>
  <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; font-family: system-ui, sans-serif">
    <p style="margin: 0 0 8px; font-weight: 600">
      Vue — <code>@openpronoun/core</code>
    </p>
    <input
      v-model="input"
      placeholder="e.g. she/her, they/them"
      style="border: 1px solid #e2e8f0; border-radius: 4px; font-size: 14px; padding: 6px 10px; width: 100%; box-sizing: border-box"
    />
    <dl v-if="parsed" style="font-size: 13px; margin: 10px 0 0">
      <div style="display: flex; gap: 8px; margin-bottom: 4px">
        <dt style="color: #718096; min-width: 80px">Short</dt>
        <dd style="margin: 0"><strong>{{ short }}</strong></dd>
      </div>
      <div style="display: flex; gap: 8px; margin-bottom: 4px">
        <dt style="color: #718096; min-width: 80px">Expanded</dt>
        <dd style="margin: 0"><strong>{{ expanded }}</strong></dd>
      </div>
      <div style="display: flex; gap: 8px">
        <dt style="color: #718096; min-width: 80px">Entries</dt>
        <dd style="margin: 0">{{ parsed.length }}</dd>
      </div>
    </dl>
    <p v-if="!parsed && input" style="color: #718096; font-size: 13px; margin: 8px 0 0">
      No pronouns recognized.
    </p>
  </div>
</template>
