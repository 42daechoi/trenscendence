import React, { useState } from 'react'
import '../css/MyProfile.css'

export default function MyProfile() {
	const [selectedFile, setSelectedFile] = useState(null);
	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};
	const handleFileUpload = () => {
		if (selectedFile) {
			{/*파일 전송*/}
			console.log();
		}
	}
	return (
		<div className='my-profile-container'>
			<div className='avatar-wrapper'><img src="./profile.jpeg" alt="" className='avatar'></img></div>
			<div className='my-nickname'>daechoi</div>
			<div className='fix-profile'>
				<div className='modal-avatar'>
					<button onClick={()=>window.my_modal_2.showModal()} className="btn-fix glass">아바타 수정</button>
					<dialog id="my_modal_2" className="modal">
						<form method="dialog" className="modal-box">
							<h3 className="font-bold text-lg">아바타 수정</h3>
							<input type='file' accept='.jpg, .jpeg, .png' onChange={handleFileChange}/>
							<button className='avatar-upload' onClick={handleFileUpload}>수정하기</button>
						</form>
						<form method="dialog" className="modal-backdrop">
							<button>close</button>
						</form>
					</dialog>
				</div>
				<div className='modal-nickname'>
					<button onClick={()=>window.my_modal_3.showModal()} className="btn-fix glass">닉네임 수정</button>
					<dialog id="my_modal_3" className="modal">
						<form method="dialog" className="modal-box">
							<h3 className="font-bold text-lg">닉네임 수정</h3>
							<input type='text'/>
							<button className='avatar-upload' onClick={handleFileUpload}>수정하기</button>
						</form>
						<form method="dialog" className="modal-backdrop">
							<button>close</button>
						</form>
					</dialog>
				</div>
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
