import type { Ref } from 'vue';
import { sidebarMenu, type MenuItem } from '@/constants/sidebarMenu';

function filterMenuItems(
  items: readonly MenuItem[],
  hasPermission: (required?: MenuItem['permissionKey']) => boolean,
): MenuItem[] {
  return items.reduce<MenuItem[]>((result, item) => {
    if (item.permissionKey && !hasPermission(item.permissionKey)) {
      return result;
    }

    if (!item.items) {
      result.push(item);
      return result;
    }

    const children = filterMenuItems(item.items, hasPermission);
    if (children.length === 0) {
      return result;
    }

    result.push({
      ...item,
      items: children,
    });

    return result;
  }, []);
}

function findActiveMenuPath(
  items: readonly MenuItem[],
  routeName: string | null | undefined,
  parentKeys: string[] = [],
): string[] | null {
  if (!routeName) {
    return null;
  }

  for (const [index, item] of items.entries()) {
    const currentPath = [...parentKeys, String(index)];

    if (item.to === routeName) {
      return currentPath;
    }

    if (item.items) {
      const childPath = findActiveMenuPath(item.items, routeName, currentPath);

      if (childPath) {
        return childPath;
      }
    }
  }

  return null;
}

function normalizeRouteName(routeName: unknown): string | undefined {
  if (typeof routeName !== 'string') {
    return undefined;
  }

  const trimmed = routeName.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function useSidebarMenu(expandedMenuPath: Ref<string[]>, currentRouteMenuItems: Ref<string[]>) {
  const { hasPermission } = usePermission();
  const router = useRouter();

  const filteredMenu = computed(() => filterMenuItems(sidebarMenu, hasPermission));

  function setCurrentMenuPath(path: string[] | null) {
    const nextPath = path ?? [];

    expandedMenuPath.value = [...nextPath];
    currentRouteMenuItems.value = [...nextPath];
  }

  const syncActiveMenu = () => {
    const routeName = normalizeRouteName(router.currentRoute.value.name);
    const path = findActiveMenuPath(filteredMenu.value, routeName);
    setCurrentMenuPath(path);
  };

  watch(
    [() => router.currentRoute.value.name, filteredMenu],
    syncActiveMenu,
    { immediate: true },
  );

  return {
    filteredMenu,
    syncActiveMenu,
  };
}
