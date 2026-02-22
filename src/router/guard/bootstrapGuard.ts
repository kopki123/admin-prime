import type { Router } from 'vue-router';

export interface BootstrapGuardOptions {
  /** 實際的初始化邏輯，由各 app 傳進來 */
  bootstrap: () => Promise<void> | void;
  /** 遇到錯誤時要不要自訂處理，不給的話預設 console.error */
  onError?: (error: unknown) => void;
}

/**
 * 註冊一個「只會跑一次」的 beforeEach：
 * - 導航時執行 bootstrap()
 * - 只有 bootstrap 成功才會把 guard 解除註冊
 * - 失敗時保留 guard，讓下一次導航可重試
 */
export function setupBootstrapGuard(router: Router, options: BootstrapGuardOptions) {
  let isBootstrapped = false;
  let bootstrapTask: Promise<void> | null = null;

  const removeGuard = router.beforeEach(async () => {
    if (isBootstrapped) {
      return true;
    }

    if (!bootstrapTask) {
      bootstrapTask = Promise.resolve(options.bootstrap());
    }

    try {
      await bootstrapTask;
      isBootstrapped = true;
      removeGuard();
    } catch (error) {
      if (options.onError) {
        options.onError(error);
      } else {
        console.error(error);
      }

      // 初始化失敗時，下一次導航要能重新嘗試 bootstrap
      bootstrapTask = null;
    }

    return true;
  });
}
