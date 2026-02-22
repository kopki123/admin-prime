import type { Directive, DirectiveBinding } from 'vue';
import type { RawPermission } from '@/constants/permissions';
import { usePermission } from '@/composables/usePermission';

type Mode = 'all' | 'any';

export const vPermission: Directive<HTMLElement, MaybeArray<RawPermission>> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<MaybeArray<RawPermission>>) {
    const { value, modifiers } = binding;

    if (!value) return;

    const { hasAll, hasAny } = usePermission();

    const mode: Mode = modifiers.all ? 'all' : 'any';
    const allowed = mode === 'all' ? hasAll(value) : hasAny(value);

    if (!allowed) {
      el.hidden = true;
    }
  },
};
