import React, { Component } from "react";
import './LoginPage.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


function LoginPage() {
	return (
		<div className="hero min-h-screen bg-base-200">
		<div className="hero-content flex-col lg:flex-row-reverse">
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
				<Link to={"/main"} className="btn btn-primary">Login</Link>
			  </div>
			</div>
		  </div>
		</div>
	  	</div>
	);
}

export default LoginPage;
