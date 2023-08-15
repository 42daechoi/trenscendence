import React, { useEffect, useState } from 'react'
import '../css/TwoFactoryAuth.css'
import OtpSet from '../component/OtpSet';
import GoogleAuth from '../component/GoogleAuth';
import axios from 'axios';

export default function TwoFactoryAuth() {
	const [curPage, setCurPage] = useState("google_auth");

	useEffect(() => {
		axios.get('http://localhost:3001/users/whoami',{ withCredentials: true })
			.then(response => {
				response.data.twoFA === true ? setCurPage('google_auth') : setCurPage('otp_set');
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
				return <GoogleAuth/>;
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
