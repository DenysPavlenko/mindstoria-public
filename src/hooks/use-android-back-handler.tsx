import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export const useAndroidBackHandler = (callback: () => boolean | void) => {
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      // If callback returns true we stop default behavior
      return callback() === true;
    });
    return () => sub.remove();
  }, [callback]);
};
