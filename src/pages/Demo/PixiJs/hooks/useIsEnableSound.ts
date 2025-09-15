import { useLocalStorageState } from 'ahooks';

export const useIsEnableSound = () => {
  const [isEnableSound, setIsEnableSound] = useLocalStorageState<boolean>('yummy_is_enable_sound', {
    defaultValue: true,
    listenStorageChange: true
  });
  return {
    isEnableSound,
    setIsEnableSound
  };
};
