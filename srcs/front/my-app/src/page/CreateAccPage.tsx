import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/CreateAccPage.css'
import axios from 'axios';
import { response } from 'express';

export default function CreateAccPage() {
	const navigate = useNavigate();
	
	useEffect(() => {
		axios.get('http://localhost:3001/users/whoami')
			.then(response => {
				console.log(response.data);
			})
			.catch(error => {
				console.log(error);
			})
	}, []);

	let	isDuplication:boolean = true;

	const checkDuplication = () => {
		isDuplication = false;
	}
	const createAccount = () => {
		if (!isDuplication)
			navigate('/main');
	}
  	return (
		<div className='background'>
			<div className='account-box'>
				<div>설정을 하지 않거나 이탈할 경우 기본 닉네임과 아바타로 설정됩니다.</div>
				<div>
					닉네임
					<input type='text' defaultValue={'ID'}></input>
					<button onClick={checkDuplication}>중복 확인</button>
				</div>
				<div>아바타<input className='avatar-file' type='file' accept='.jpg, .jpeg, .png'></input></div>
				<button onClick={createAccount}>계정 생성</button>
			</div>
		</div>
  	)
}
