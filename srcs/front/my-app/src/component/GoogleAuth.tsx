import axios from 'axios';
import { response } from 'express';
import React, { useState, useRef } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
		axios.post('http://localhost:3001/2fa/enable', { twoFactorAuthCode: fullotp }, { withCredentials: true })
			.then(response => {
				console.log(response.data);
			})
			.catch(error => {
				console.log(error.message);
				toast.error('인증번호가 일치하지 않습니다.', {
					position: toast.POSITION.TOP_LEFT,
					style: {
						width: '500px',
						height: '100px',
						fontSize: '30px',
					},
					autoClose: 1500,
				});
			})
	}

	const firstOtpRef = useRef(null);
	const secondOtpRef = useRef(null);
  
	const handleInput = (event) => {
	  const maxLength = firstOtpRef.current.maxLength;
	  const currentLength = event.target.value.length;
  
	  if (currentLength >= maxLength) {
		secondOtpRef.current.focus();
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
		<ToastContainer/>
	</div>
  )
}