import { submitFirstAttemptPerformance } from '../api/staarApi';

async function firstAttemptSubmission(subject, performanceData) {
  try {
    return await submitFirstAttemptPerformance(subject, performanceData);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default firstAttemptSubmission;
