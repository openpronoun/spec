<!--
  PLACEHOLDER — example content owned by the maintainer.
  This proves the Vue integration builds and hydrates.
-->
<script setup lang="ts">
import { placeholder } from "@openpronoun/core";

const value = placeholder();
</script>

<template>
  <div style="padding: 1rem; border: 1px solid #444; border-radius: 8px">
    <p><strong>Vue</strong> — via <code>@openpronoun/core</code>:</p>
    <p>
      Result: <code>{{ value }}</code>
    </p>
  </div>
</template>
