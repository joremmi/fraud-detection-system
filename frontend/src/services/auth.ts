import {api} from './api';

export const verifyOTP = async (otp: string) => {
  try {
    const response = await api.post('/verify-otp', { otp });
    return response.data;
  } catch (error) {
    throw new Error('OTP verification failed');
  }
}; 