import { fetchResponsesByUserAndModule } from '../api/staarApi';

async function getResponsesByUserAndModule(targetSubject, userId, moduleId) {
  try {
    return await fetchResponsesByUserAndModule(targetSubject, userId, moduleId);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default getResponsesByUserAndModule;
