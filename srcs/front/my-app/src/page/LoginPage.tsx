import React from "react";
import '../css/LoginPage.css';



function LoginPage() {
	const login42 = () => {
		window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-f4c503686eab1c55ce129fb139631102c31e6d5391579afdaa6e576c7f2840a9&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&response_type=code';
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