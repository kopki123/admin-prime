import camelCase from 'lodash-es/camelCase';
import snakeCase from 'lodash-es/snakeCase';

/**
 * 將物件的所有鍵名（key）轉換為 camelCase（小駝峰命名）。
 * 遞迴處理巢狀物件與陣列，保留原始值。
 *
 * @param obj - 欲轉換鍵名的物件或陣列。
 * @returns 轉換後的新物件或陣列（不會改變原始資料）。
 *
 * @example
 * keysToCamel({ user_name: 'John', user_info: { user_age: 30 } });
 * // => { userName: 'John', userInfo: { userAge: 30 } }
 */
export function keysToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(keysToCamel);
  }

  if (obj !== null && obj.constructor === Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [camelCase(k), keysToCamel(v)]),
    );
  }

  return obj;
}

/**
 * 將物件的所有鍵名（key）轉換為 snake_case（底線命名）。
 * 遞迴處理巢狀物件與陣列，保留原始值。
 *
 * @param obj - 欲轉換鍵名的物件或陣列。
 * @returns 轉換後的新物件或陣列（不會改變原始資料）。
 *
 * @example
 * keysToSnake({ userName: 'John', userInfo: { userAge: 30 } });
 * // => { user_name: 'John', user_info: { user_age: 30 } }
 */
export function keysToSnake(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(keysToSnake);
  }

  if (obj !== null && obj.constructor === Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [snakeCase(k), keysToSnake(v)]),
    );
  }

  return obj;
}
