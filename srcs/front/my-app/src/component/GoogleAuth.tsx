import React, { useState, useRef } from 'react'

export default function GoogleAuth() {
	const [otp, setOtp] = useState('');
	const [otp2, setOtp2] = useState('');

  	const handleOtpChange = (event) => {
    	const inputOtp = event.target.value;
    	setOtp(inputOtp);
  	};
	const handleOtpChange2 = (event) => {
    	const inputOtp = event.target.value;
    	setOtp2(inputOtp);
  	};

	const handleOtpClick = () => {
		const fullotp = otp + otp2;
		console.log(fullotp);
	}

	const firstOtpRef = useRef(null);
	const secondOtpRef = useRef(null);
  
	const handleInput = (event) => {
	  const maxLength = firstOtpRef.current.maxLength;
	  const currentLength = event.target.value.length;
  
	  if (currentLength >= maxLength) {
		secondOtpRef.current.focus();
		console.log(maxLength);
		console.log(currentLength);
	  }
	};
  return (
	<div>
		<div style={{fontSize:'20px', marginTop:'50px'}}>Google OTP (Google Authenticator) 인증번호</div>
		<input
			type="password"
			ref={firstOtpRef}
			maxLength={3}
			value={otp}
			onChange={handleOtpChange}
			onInput={handleInput}
			style={{ textAlign:'center', marginTop:'30px', marginBottom:'30px', padding: '10px', fontSize: '50px', width: '120px', border: '1px solid #ccc' }}
		/>
		<input
			type="password"
			ref={secondOtpRef}
			maxLength={3}
			value={otp2}
			onChange={handleOtpChange2}
			style={{ textAlign:'center', marginLeft:'30px', marginTop:'30px', marginBottom:'30px', padding: '10px', fontSize: '50px', width: '120px', border: '1px solid #ccc' }}
		/>
		<br></br>
		<button className='login' onClick={handleOtpClick} style={{width:'100px', height:'50px', fontSize:'20px'}}>인증하기</button>
	</div>
  )
}
