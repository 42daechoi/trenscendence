import React, { useState } from 'react'
import '../css/TwoFactoryAuth.css'
import OtpSet from '../component/OtpSet';
import GoogleAuth from '../component/GoogleAuth';

export default function TwoFactoryAuth() {
	const [curPage, setCurPage] = useState("google_auth");
	
	const isFirst = true;

	const renderPage = () => {
		if (isFirst)
			return <OtpSet/>;
		else
			return <GoogleAuth/>;
	};
	return (
		<div className="background">
			<div className='tfa'>
				{renderPage()}
			</div>
		</div>
	)
}
