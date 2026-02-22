<script setup lang="ts">
const currentYear = new Date().getFullYear();
const githubRepoUrl = 'https://github.com/kopki123/admin-prime';
</script>

<template>
  <footer
    class="
      flex flex-wrap items-center justify-center gap-2
      p-2
      text-xs text-surface-500 dark:text-surface-400
    "
  >
    <span>
      {{ $t('footer.copyright', { year: currentYear, project: $t('system.title') }) }}
    </span>

    <span>|</span>

    <span>MIT License</span>

    <span>|</span>

    <Button
      :label="$t('footer.source_code')"
      icon="pi pi-github"
      :href="githubRepoUrl"
      target="_blank"
      rel="noopener noreferrer"
      as="a"
      link
      class="p-0! text-xs font-normal text-surface-500 dark:text-surface-400"
    />
  </footer>
</template>
