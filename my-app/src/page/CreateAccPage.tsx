import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/CreateAccPage.css'

export default function CreateAccPage() {
	const navigate = useNavigate();
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
				<div>인트라 아이디</div>
				<div>
					닉네임
					<input type='text' defaultValue={'인트라 아이디'}></input>
					<button onClick={checkDuplication}>중복 확인</button>
				</div>
				<div>아바타<input className='avatar-file' type='file' accept='.jpg, .jpeg, .png'></input></div>
				<button onClick={createAccount}>계정 생성</button>
			</div>
		</div>
  	)
}
