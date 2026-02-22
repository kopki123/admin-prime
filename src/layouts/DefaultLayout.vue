<script setup lang="ts">
import AppFooter from '@/components/layout/AppFooter.vue';
import AppBreadcrumb from '@/components/layout/AppBreadcrumb.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import LanguageSelector from '@/components/layout/LanguageSelector.vue';
import NotificationMenu from '@/components/layout/NotificationMenu.vue';
import FullscreenToggle from '@/components/layout/FullscreenToggle.vue';
import ThemeSwitcher from '@/components/layout/ThemeSwitcher.vue';
import UserMenu from '@/components/layout/UserMenu.vue';
import TagsView from '@/components/layout/TagsView.vue';
import { useConfigStore } from '@/stores/config';
import { useTagsViewStore } from '@/stores/tagsView';
import logo from '@/assets/images/logo.webp';

const configStore = useConfigStore();
const tagsViewStore = useTagsViewStore();
</script>

<template>
  <div class="w-screen h-screen flex flex-col bg-surface-50 dark:bg-surface-900">
    <header
      class="
        shrink-0
        border-b border-surface-200 bg-white/95
        dark:border-surface-700 dark:bg-surface-900/95
      "
    >
      <Toolbar class="border-none bg-transparent p-4">
        <template #start>
          <div class="flex items-center gap-2">
            <Image
              :src="logo"
              width="24"
              alt="logo"
            />
            <Button
              icon="pi pi-bars"
              severity="secondary"
              rounded
              text
              :aria-label="$t('common.button.more')"
              @click="configStore.toggleSidebar"
            />
            <AppBreadcrumb />
          </div>
        </template>

        <template #end>
          <div class="flex items-center gap-2">
            <FullscreenToggle />
            <NotificationMenu />
            <ThemeSwitcher />
            <LanguageSelector />
            <UserMenu />
          </div>
        </template>
      </Toolbar>
    </header>

    <div class="overflow-hidden flex-1 flex">
      <Sidebar />

      <div class="overflow-auto flex-1 flex flex-col min-h-0">
        <TagsView />

        <main
          class="
            overflow-y-auto flex-1
            bg-surface-100 dark:bg-surface-950
          "
        >
          <div class="flex flex-col min-h-full ">
            <div class="flex-1 p-4">
              <RouterView v-slot="{ Component, route: viewRoute }">
                <!-- KeepAlive 命中的條件來自 tagsViewStore.cachedViews。 頁面組件請設定 defineOptions({ name: 'YourComponentName' })，才能被 include 正確命中。 -->
                <KeepAlive :include="tagsViewStore.cachedViews">
                  <component
                    :is="Component"
                    v-if="viewRoute.meta.keepAlive"
                    :key="String(viewRoute.name ?? viewRoute.fullPath)"
                  />
                </KeepAlive>

                <component
                  :is="Component"
                  v-if="!viewRoute.meta.keepAlive"
                  :key="String(viewRoute.name ?? viewRoute.fullPath)"
                />
              </RouterView>
            </div>

            <AppFooter />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
