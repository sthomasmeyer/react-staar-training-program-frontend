import { useEffect, useState } from 'react';
import { fetchUserById } from '../api/staarApi';

const useUserInfoById = (userIdProp) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    const userId =
      userIdProp ?? sessionStorage.getItem('staar-training-platform-user-id');

    async function loadUserInfo() {
      try {
        const data = await fetchUserById(userId);
        if (!isCancelled) {
          setUserInfo(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadUserInfo();
    return () => {
      isCancelled = true;
    };
  }, [userIdProp]);

  if (isLoading) {
    return null;
  }

  return userInfo;
};

export default useUserInfoById;
