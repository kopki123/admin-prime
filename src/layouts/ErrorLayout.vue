<script setup lang="ts">
import ThemeSwitcher from '@/components/layout/ThemeSwitcher.vue';
import LanguageSelector from '@/components/layout/LanguageSelector.vue';
</script>

<template>
  <div
    class="
      relative min-h-screen overflow-hidden
      bg-surface-50 text-surface-900
      dark:bg-surface-950 dark:text-surface-0
    "
  >
    <div class="pointer-events-none absolute inset-0">
      <div
        class="
          absolute -top-40 -left-24 w-160 h-160 rounded-full
          bg-primary-400/15 blur-3xl
          dark:bg-primary-500/10
        "
      />
      <div
        class="
          absolute -bottom-40 -right-16 w-160 h-160 rounded-full
          bg-purple-400/15 blur-3xl
          dark:bg-purple-500/10
        "
      />
    </div>

    <header class="z-10 relative flex justify-end gap-2 p-4">
      <ThemeSwitcher />
      <LanguageSelector />
    </header>

    <main class="z-10 relative flex min-h-[calc(100vh-72px)] items-center justify-center p-4 sm:p-6">
      <RouterView v-slot="{ Component }">
        <Transition
          name="fade"
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>
