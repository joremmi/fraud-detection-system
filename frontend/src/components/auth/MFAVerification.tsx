import { useState } from 'react';
import { verifyOTP } from '../../services/auth';

const MFAVerification = () => {
  const [otp, setOtp] = useState('');
  
  const handleVerify = async () => {
    // Implement OTP verification
  };

  return (
    <div className="mfa-container">
      <input 
        type="text" 
        value={otp} 
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
};

export default MFAVerification; 