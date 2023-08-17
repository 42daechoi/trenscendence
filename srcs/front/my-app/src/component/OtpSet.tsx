import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import { response } from 'express'
import { request } from 'http';

export default function OtpSet(props) {
	const img_src = useRef(null);

	useEffect(()=> {
		axios.post('http://localhost:3001/2fa/register', null, { withCredentials: true })
			.then(response => {
				img_src.current.src = response.data;
				
			})
			.catch(error => {
				console.log(error);
			})
	},[]);

	const btnOnClick = () => {
		props.onChangePage('google_auth');
	}
	return (
		<div style={{ width:'100%', display:'flex', textAlign: 'center', justifyContent:'center', flexDirection:'column'}}>
			<div style={{width:'100%'}}>Google OTP (Google Authenticator) QR코드를 인식하여 OTP를 등록합니다.<br></br>
			</div>
			<img style={{width:'200px', height:'200px', marginLeft:'150px', marginTop:'30px'}} ref={img_src}></img>
			<button onClick={btnOnClick}
				className='login'
				style={{width:'200px', height:'80px', marginLeft:'150px', fontSize:'25px', marginTop:'30px', marginBottom:'30px', borderRadius:'10px'}}>
				등록 완료
			</button>
			<div style={{fontSize:'13px', color:'red'}}>QR 코드 등록 후 tr42 탭이 생긴 것을 확인한 후 등록 완료 버튼을 눌러주세요.</div>
	</div>
	)
}