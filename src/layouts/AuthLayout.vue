<script setup lang="ts">
import AppFooter from '@/components/layout/AppFooter.vue';
import LanguageSelector from '@/components/layout/LanguageSelector.vue';
import ThemeSwitcher from '@/components/layout/ThemeSwitcher.vue';
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

    <div class="z-10 relative flex min-h-screen flex-col">
      <header class="z-10 absolute top-4 right-4 flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSelector />
      </header>

      <main class="flex-1 flex items-center justify-center p-4">
        <RouterView v-slot="{ Component }">
          <Transition
            name="fade"
            mode="out-in"
          >
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>

      <AppFooter />
    </div>
  </div>
</template>
