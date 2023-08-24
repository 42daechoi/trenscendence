import React, { useEffect, useState } from 'react'
import '../css/TwoFactoryAuth.css'
import OtpSet from '../component/OtpSet';
import GoogleAuth from '../component/GoogleAuth';
import axios from 'axios';

export default function FullTFA() {
	const [curPage, setCurPage] = useState("google_auth");
	const [curState, setState] = useState(true);
	useEffect(() => {
		axios.get('http://localhost:3001/users/OTPwhoami', { withCredentials: true })
			.then(response => {
				response.data.twoFASecret === null ? setCurPage('otp_set') : setCurPage('google_auth');
				if (response.data.twoFASecret && !response.data.twoFA) setCurPage('otp_set');
				response.data.twoFA === true ? setState(true) : setState(false);
			})
			.catch(error => {
				console.log(error);
			})
	}, []);

	const renderPage = () => {
		switch (curPage) {
			case 'otp_set':
				return <OtpSet onChangePage={changePage}/>;
			case 'google_auth':
				return <GoogleAuth state={curState} />;
		}
	};
	const changePage = (nextPage) => {
		setCurPage(nextPage);
	} 
	return (
		<div className="background">
			<div className='tfa'>
				{renderPage()}
			</div>
		</div>
	)
}
