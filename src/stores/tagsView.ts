import type { RouteLocationNormalizedLoaded, RouteRecordNormalized } from 'vue-router';

type AsyncRouteComponent = () => Promise<unknown>;

export interface VisitedView {
  name: string;
  path: string;
  fullPath: string;
  meta: {
    i18nKey: string;
    keepAlive: boolean;
  };
  componentName?: string;
}

function isAsyncRouteComponent(component: unknown): component is AsyncRouteComponent {
  return typeof component === 'function';
}

function extractComponentName(component: unknown): string | null {
  if (!component || typeof component !== 'object') {
    return null;
  }

  const target = component as { name?: unknown; __name?: unknown };

  if (typeof target.name === 'string' && target.name) {
    return target.name;
  }

  if (typeof target.__name === 'string' && target.__name) {
    return target.__name;
  }

  return null;
}

async function resolveRecordComponentName(record: RouteRecordNormalized): Promise<string | null> {
  const component = record.components?.default;

  if (!component) {
    return null;
  }

  if (isAsyncRouteComponent(component)) {
    const loadedModule = await component();
    const loadedComponent = (loadedModule as { default?: unknown })?.default ?? loadedModule;

    return extractComponentName(loadedComponent);
  }

  return extractComponentName(component);
}

async function resolveRouteComponentName(route: RouteLocationNormalizedLoaded): Promise<string | null> {
  const targetRecord = [...route.matched].reverse().find((record) => record.components?.default);

  if (!targetRecord) {
    return null;
  }

  return resolveRecordComponentName(targetRecord);
}

export const useTagsViewStore = defineStore('tagsView', () => {
  const dashboardVisitedView: VisitedView = {
    name: 'dashboard',
    path: '/',
    fullPath: '/',
    meta: {
      i18nKey: 'route.dashboard',
      keepAlive: true,
    },
  };

  const visitedViews = ref<VisitedView[]>([dashboardVisitedView]);
  const cachedViews = ref<string[]>([]);

  function normalizeRouteName(routeName: RouteLocationNormalizedLoaded['name']): string {
    return typeof routeName === 'string' ? routeName : '';
  }

  function normalizeRouteTitle(route: RouteLocationNormalizedLoaded): string {
    if (typeof route.meta?.i18nKey === 'string' && route.meta.i18nKey) {
      return route.meta.i18nKey;
    }

    return normalizeRouteName(route.name) || route.path;
  }

  function upsertVisitedView(view: VisitedView) {
    const index = visitedViews.value.findIndex((item) => item.path === view.path);

    if (index === -1) {
      visitedViews.value.push(view);
      return;
    }

    visitedViews.value[index] = {
      ...visitedViews.value[index],
      ...view,
    };
  }

  function addCachedComponent(componentName?: string) {
    if (!componentName) {
      return;
    }

    if (!cachedViews.value.includes(componentName)) {
      cachedViews.value.push(componentName);
    }
  }

  async function addView(route: RouteLocationNormalizedLoaded): Promise<void> {
    const routeName = normalizeRouteName(route.name);

    if (!routeName) {
      return;
    }

    const keepAlive = Boolean(route.meta?.keepAlive);
    const componentName = keepAlive ? await resolveRouteComponentName(route) : null;

    upsertVisitedView({
      name: routeName,
      path: route.path,
      fullPath: route.fullPath,
      meta: {
        i18nKey: normalizeRouteTitle(route),
        keepAlive,
      },
      componentName: componentName ?? undefined,
    });

    if (keepAlive) {
      addCachedComponent(componentName ?? undefined);
    }
  }

  function deleteView(view: VisitedView): VisitedView | null {
    if (view.name === 'dashboard') {
      return null;
    }

    const index = visitedViews.value.findIndex((item) => item.path === view.path);

    if (index === -1) {
      return null;
    }

    const [removedView] = visitedViews.value.splice(index, 1);

    if (removedView?.componentName) {
      const isStillUsed = visitedViews.value.some((item) =>
        item.componentName === removedView.componentName && item.meta.keepAlive,
      );

      if (!isStillUsed) {
        cachedViews.value = cachedViews.value.filter((name) => name !== removedView.componentName);
      }
    }

    return removedView ?? null;
  }

  return {
    visitedViews,
    cachedViews,
    addView,
    deleteView,
  };
});
