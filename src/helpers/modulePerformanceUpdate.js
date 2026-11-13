import { patchModulePerformance } from '../api/staarApi';

async function modulePerformanceUpdate(subject, performanceData) {
  try {
    return await patchModulePerformance(subject, performanceData);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default modulePerformanceUpdate;
