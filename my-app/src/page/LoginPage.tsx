import React from "react";
import '../css/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


function LoginPage() {
	const navigate = useNavigate();
	const loginCall = () => {
		const dataToSend = {
			email : 'email@test.com',
			password : 'password',
		};
		axios.post('http://10.19.218.63:3000/auth/signin', dataToSend)
			.then(response => {
				if (response.data)
				navigate('/create-account');
		  	})
		  	.catch(error => {
				if (error.response) {
			  	// 서버가 요청을 받았으나 응답 상태 코드가 실패인 경우
			  	console.error(error.response.data);
			  	console.error(error.response.status);
				} else if (error.request) {
				// 요청이 브라우저에 도달하지 않은 경우 (CORS 등의 이유)
				console.error(error.request);
				} else {
				// 기타 다른 오류
				console.error('Error', error.message);
				}
			});
	}
	const login42 = () => {
		window.open('https://api.intra.42.fr/oauth/authorize');
	}
	return (
		<div className="hero min-h-screen bg-base-200">
			<button onClick={login42} className="login">LOGIN WITH 42</button>
			<div>해당 홈페이지는 PC와 태블릿에 최적화 되어 있습니다.</div>
		{/* <div className="hero-content flex-col lg:flex-row-reverse">
		  <div className="text-center lg:text-left">
			<h1 className="text-5xl font-bold">Login</h1>
			<p className="py-6">42 인트라넷 계정을 통해서만 로그인 할 수 있습니다.</p>
		  </div>
		  <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
			<div className="card-body">
			  <div className="form-control">
				<label className="label">
				  <span className="label-text">Email</span>
				</label>
				<input type="text" placeholder="email" className="input input-bordered" />
			  </div>
			  <div className="form-control">
				<label className="label">
				  <span className="label-text">Password</span>
				</label>
				<input type="password" placeholder="password" className="input input-bordered" />
				<label className="label">
				  <a href="https://signin.intra.42.fr/users/password/new" className="label-text-alt link link-hover">Forgot password?</a>
				</label>
			  </div>
			  <div className="form-control mt-6">
				<button className="btn btn-primary" onClick={loginCall}>Login</button>
			  </div>
			</div>
		  </div>
		</div> */}
	  	</div>
	);
}

export default LoginPage;
