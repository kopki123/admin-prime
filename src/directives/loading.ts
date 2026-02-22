import type { Directive, DirectiveBinding } from 'vue';
import Loading from '@/components/Loading.vue';

interface LoadingInstance {
  show: () => void
  hide: () => void
  $el: HTMLElement
}

function toggleLoading(show: boolean, ctx: { instance: LoadingInstance; fullscreen: boolean }) {
  const { instance, fullscreen } = ctx;

  if (show) {
    instance.show();

    if (fullscreen) {
      document.body.style.overflow = 'hidden';
    }
  } else {
    instance.hide();

    if (fullscreen) {
      document.body.style.overflow = '';
    }
  }
}

export const vLoading: Directive<HTMLElement, boolean> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    const fullscreen = binding.modifiers.fullscreen ?? false;
    const app = createApp(Loading, { fullscreen });
    const container = document.createElement('div');
    const instance = app.mount(container) as unknown as LoadingInstance;

    (el as any)._loadingInstance = { app, instance, fullscreen };

    const parent = fullscreen ? document.body : el;
    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }
    parent.appendChild(instance.$el);

    if (binding.value) {
      toggleLoading(true, { instance, fullscreen });
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    const ctx = (el as any)._loadingInstance;

    if (!ctx || binding.value === binding.oldValue) {
      return;
    }

    toggleLoading(binding.value, ctx);
  },

  unmounted(el: HTMLElement) {
    const ctx = (el as any)._loadingInstance;

    if (!ctx) {
      return;
    }

    const { app, instance, fullscreen } = ctx;
    instance.hide();

    if (instance.$el.parentNode) {
      instance.$el.parentNode.removeChild(instance.$el);
    }

    app?.unmount?.();

    if (fullscreen) {
      document.body.style.overflow = '';
    }

    delete (el as any)._loadingInstance;
  },
};
