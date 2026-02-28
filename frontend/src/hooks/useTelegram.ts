const tg = (window as any).Telegram?.WebApp;

export function useTelegram() {
  return {
    MainButton: tg?.MainButton ?? null,
    BackButton: tg?.BackButton ?? null,
    haptic: tg?.HapticFeedback ?? null,
    inTelegram: !!(tg?.initData),
  };
}
