import { useEffect, useState } from 'react';
import axios from 'axios';

let BASE_API_URL = 'https://english-two-staar-training.herokuapp.com';

if (process.env.NODE_ENV === 'development') {
  BASE_API_URL = 'http://localhost:8000';
}

const useUserInfoById = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    let userId = sessionStorage.getItem('staar-training-platform-user-id');
    let token = sessionStorage.getItem('staar-training-platform-jwt');

    async function getUserInfo(id, jwt) {
      let res = await axios.get(`${BASE_API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      setUserInfo(res.data);
      setIsLoading(false);
    }
    getUserInfo(userId, token);
  }, []);

  if (isLoading) {
    return null;
  }

  return userInfo;
};

export default useUserInfoById;
