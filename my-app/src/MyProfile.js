import React from 'react'

export default function MyProfile() {
  return (
	<div className='my-profile-container'>
		<div className='avatar-wrapper'><img src="./profile.jpeg" alt="" className='avatar'></img></div>
		<div className='my-nickname'>daechoi</div>
		<div className='fix-profile'>
			<button className="btn-fix glass">아바타 수정</button>
			<button className="btn-fix glass">닉네임 수정</button>
		</div>
		<div className='history'>
			<ul>
				<li>daechoi vs king  4:3  win</li>
				<li>eunji vs hello 4:5  lose</li>
			</ul>
		</div>
	</div>
  )
}
