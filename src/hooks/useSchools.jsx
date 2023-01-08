import { useEffect, useState } from 'react';
import axios from 'axios';

let BASE_API_URL;

if (process.env.NODE_ENV === 'development') {
  BASE_API_URL = 'http://localhost:8000';
}

// This Hook is designed to GET information about every school in the database...
// If this app becomes more popular, then more targeted Hooks must be developed...
// For example: 'useSchoolsByCity', 'useSchoolsByCounty', or 'useSchoolsByDistrict'
const useSchools = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    async function getSchools() {
      let schools = await axios.get(`${BASE_API_URL}/schools/`);
      setSchools(schools.data);
      setIsLoading(false);
    }
    getSchools();
  }, []);

  if (isLoading) {
    return null;
  }

  return schools;
};

export default useSchools;
