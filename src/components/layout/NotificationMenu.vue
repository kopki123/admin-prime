<script setup lang="ts">
type NotificationType = 'system' | 'message' | 'warning' | 'report';

interface NotificationTime {
  key: string;
  params?: Record<string, string | number>;
}

interface Notification {
  id: number;
  type: NotificationType;
  titleKey: string;
  descriptionKey: string;
  time: NotificationTime;
  isRead: boolean;
}

interface NotificationTypeMeta {
  icon: string;
  iconClass: string;
}

const panelRef = ref<{ toggle: (event: Event) => void; hide: () => void } | null>(null);

const typeMeta: Record<NotificationType, NotificationTypeMeta> = {
  system: {
    icon: 'pi pi-cog',
    iconClass: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
  },
  message: {
    icon: 'pi pi-envelope',
    iconClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
  warning: {
    icon: 'pi pi-exclamation-triangle',
    iconClass: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
  },
  report: {
    icon: 'pi pi-chart-line',
    iconClass: 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
  },
};

const notifications = ref<Notification[]>([
  {
    id: 1,
    type: 'system',
    titleKey: 'notifications.items.system_update.title',
    descriptionKey: 'notifications.items.system_update.description',
    time: { key: 'notifications.time.minutes_ago', params: { count: 10 } },
    isRead: false,
  },
  {
    id: 2,
    type: 'message',
    titleKey: 'notifications.items.new_message.title',
    descriptionKey: 'notifications.items.new_message.description',
    time: { key: 'notifications.time.minutes_ago', params: { count: 25 } },
    isRead: false,
  },
  {
    id: 3,
    type: 'warning',
    titleKey: 'notifications.items.security_alert.title',
    descriptionKey: 'notifications.items.security_alert.description',
    time: { key: 'notifications.time.hour_ago' },
    isRead: true,
  },
  {
    id: 4,
    type: 'report',
    titleKey: 'notifications.items.weekly_report.title',
    descriptionKey: 'notifications.items.weekly_report.description',
    time: { key: 'notifications.time.hours_ago', params: { count: 4 } },
    isRead: false,
  },
]);

const unreadCount = computed(() => notifications.value.filter((item) => !item.isRead).length);

function togglePanel(event: MouseEvent) {
  panelRef.value?.toggle(event);
}

function handleViewAll() {
  panelRef.value?.hide();
}

function markAllAsRead() {
  notifications.value = notifications.value.map((item) => ({ ...item, isRead: true }));
}

function markAsRead(notificationId: number) {
  notifications.value = notifications.value.map((item) => ({
    ...item,
    isRead: item.id !== notificationId ? item.isRead : true,
  }));
}
</script>

<template>
  <div>
    <OverlayBadge
      v-if="unreadCount > 0"
      :value="unreadCount"
      severity="danger"
      size="small"
    >
      <Button
        icon="pi pi-bell"
        text
        rounded
        severity="secondary"
        :aria-label="$t('notifications.title')"
        @click="togglePanel"
      />
    </OverlayBadge>

    <Button
      v-else
      icon="pi pi-bell"
      text
      rounded
      severity="secondary"
      :aria-label="$t('notifications.title')"
      @click="togglePanel"
    />

    <Popover
      ref="panelRef"
      class="w-80 max-w-[calc(100vw-2rem)]"
      dismissable
    >
      <div class="flex flex-col">
        <div class="flex items-center justify-between gap-3 px-4 py-3 border-b border-surface-200 dark:border-surface-700">
          <h3 class="text-sm font-semibold text-surface-900 dark:text-surface-0">
            {{ $t('notifications.title') }}
          </h3>

          <Button
            text
            size="small"
            :disabled="unreadCount === 0"
            :label="$t('notifications.mark_all_as_read')"
            @click="markAllAsRead"
          />
        </div>

        <div
          v-if="notifications.length > 0"
          class="max-h-96 overflow-y-auto"
        >
          <button
            v-for="item in notifications"
            :key="item.id"
            class="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors border-b border-surface-100 dark:border-surface-800 hover:cursor-pointer hover:bg-surface-100/70 dark:hover:bg-surface-800/60"
            :class="{
              'bg-blue-50/70 dark:bg-blue-500/10': !item.isRead,
            }"
            @click="markAsRead(item.id)"
          >
            <span
              class="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              :class="typeMeta[item.type].iconClass"
            >
              <i :class="typeMeta[item.type].icon" />
            </span>

            <span class="min-w-0 flex-1">
              <span class="mb-1 flex items-start justify-between gap-2">
                <span class="line-clamp-1 text-sm font-medium text-surface-900 dark:text-surface-0">
                  {{ $t(item.titleKey) }}
                </span>
                <span
                  v-if="!item.isRead"
                  class="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500"
                />
              </span>

              <span class="line-clamp-2 text-xs text-surface-500 dark:text-surface-400">
                {{ $t(item.descriptionKey) }}
              </span>

              <span class="mt-1 block text-[11px] text-surface-400 dark:text-surface-500">
                {{ $t(item.time.key, item.time.params || {}) }}
              </span>
            </span>
          </button>
        </div>

        <div
          v-else
          class="px-4 py-8 text-center text-sm text-surface-500 dark:text-surface-400"
        >
          {{ $t('notifications.empty') }}
        </div>

        <div class="py-2 border-t border-surface-200 dark:border-surface-700">
          <Button
            text
            class="w-full"
            :label="$t('notifications.view_all')"
            @click="handleViewAll"
          />
        </div>
      </div>
    </Popover>
  </div>
</template>
