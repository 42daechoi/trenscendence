import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/CreateAccPage.css'
import axios from 'axios';
import { response } from 'express';
import { modifyNickname } from '../utils/ApiRequest';
import { useRef } from 'react';

export default function CreateAccPage() {
	const nickname = useRef(null);

	const navigate = useNavigate();
	const createAccount = () => {
		if (!nickname.current.value) {
			alert("닉네임이 입력되지 않았습니다.");
			return ;
		}
		if (nickname.current.value.length > 13) {
			alert("닉네임은 13 글자를 초과할 수 없습니다.");
			return;
		}
		modifyNickname(nickname.current.value);
		navigate('/main');
	}
  	return (
		<div className='background'>
			<div className='account-box'>
				<div>설정을 하지 않거나 이탈할 경우 기본 닉네임과 아바타로 설정됩니다.</div>
				<div>
					닉네임
					<input ref={nickname} type='text' placeholder={'nickname'}></input>
				</div>
				<div>아바타<input className='avatar-file' type='file' accept='.jpg, .jpeg, .png'></input></div>
				<button onClick={createAccount}>계정 생성</button>
			</div>
		</div>
  	)
}
