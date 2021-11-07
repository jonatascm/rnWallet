import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';

export const useStorage = () => {
  const setKey = async (key: string, value: any) => {
    await RNSecureStorage.set(key, JSON.stringify(value), {
      accessible: ACCESSIBLE.WHEN_UNLOCKED,
    });
  };

  const getKey = async (key: string) => {
    const value = await RNSecureStorage.get(key);
    return JSON.parse(value ?? '');
  };

  const removeKey = async (key: string) => {
    await RNSecureStorage.remove(key);
  };

  const existsKey = async (key: string) => {
    return await RNSecureStorage.exists(key);
  };

  return {setKey, getKey, removeKey, existsKey};
};
