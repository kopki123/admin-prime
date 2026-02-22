<script setup lang="ts">
import { RouteName } from '@/router/routeNames';
import notFound from '@/assets/images/404.webp';

const router = useRouter();
</script>

<template>
  <section class="w-full max-w-xl p-8 text-center">
    <Image
      :src="notFound"
      alt="notFound"
    />

    <Button
      class="mt-2"
      size="small"
      :label="$t('error_page.actions.go_home')"
      @click="router.push({ name: RouteName.Dashboard })"
    />
  </section>
</template>
