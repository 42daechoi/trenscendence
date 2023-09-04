import React, { useEffect, useState } from 'react'
import '../css/TwoFactoryAuth.css'
import OtpSet from '../component/OtpSet';
import GoogleAuth from '../component/GoogleAuth';
import axios from 'axios';

export default function PartialTFA() {
	return (
		<div className="background">
			<div className='tfa'>
				{<GoogleAuth/>}
			</div>
		</div>
	)
}
