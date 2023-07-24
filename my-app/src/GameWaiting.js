import React from 'react'

export default function GameWaiting() {
  return (
	<div className='game-waiting-container'>
		<div className='player'>
			<div>daechoi</div><div>vs</div>
			<div>
				<button className="btn-loading btn-square">
					<span className="loading loading-spinner"></span>
				</button>
			</div>
		</div>
		<div className='game-setting'>
			<div className="form-control">
				<label className="label cursor-pointer">
					<span className="label-text">게임 어쩌구 선택 어쩌구</span> 
					<input type="checkbox" checked="checked" className="checkbox" />
				</label>
			</div>
		</div>
		<div className='ready-button'>
			<button className='btn-ready btn-outline btn-success'>READY</button>
			<button className='btn-leave btn-outline btn-error'>LEAVE</button>
		</div>
	</div>
  );
}
