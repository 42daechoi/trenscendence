import React, { Component, useState } from 'react'
import './MainPage.css'
import chat_bubble from './chat_bubble'
import check_box from './check_box';
import MyProfile from './MyProfile';
import GameWaiting from './GameWaiting';
import LeaderBoard from './LeaderBoard';
import FriendsList from './FriendsList';
import ChannelsList from './ChannelsList';

export default function MainPage() {
	const [curPage, setCurPage] = useState('my_profile');

	const renderPage = () => {
		switch (curPage) {
			case 'my_profile':
				return <MyProfile/>;
			case 'game_waiting':
				return <GameWaiting/>;
			case 'leaderboard':
				return <LeaderBoard/>;
		}
	};
	const [curSide, setCurSide] = useState('friends_list');
	const [friendsButtonClass, setFriendsButtonClass] = useState('clicked-button');
	const [channelsButtonClass, setChannelsButtonClass] = useState('default-button');

	const handleButtonClick = (side) => {
		if (side === 'friends_list') {
		  	setCurSide('friends_list');
		  	setFriendsButtonClass('clicked-button');
		  	setChannelsButtonClass('default-button');
		} 
		else if (side === 'channels_list') {
		  	setCurSide('channels_list');
		  	setFriendsButtonClass('default-button');
		  	setChannelsButtonClass('clicked-button');
		}
	  };

	const renderSide = () => {
		switch (curSide) {
			case 'friends_list':
				return <FriendsList/>;
			case 'channels_list':
				return <ChannelsList/>; 
		}
	}
		return (
			<div className='background'>
				<div className="drawer drawer-end">
					<input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
					<div className="drawer-content">
						<section className='btn-container'>
							<button className="btn btn-outline btn-success" onClick={() => setCurPage('game_waiting')}>GAME START</button>
							<button className="btn btn-outline btn-warning" onClick={() => setCurPage('my_profile')}>MY PROFILE</button>
							<button className="btn btn-outline btn-error" onClick={() => setCurPage('leaderboard')}>LEADERBOARD</button>
						</section>
						<section className='chat-container'>
							<div className='chat-box'>
								<ul>
									{/* <li><chat_bubble/></li> */}
									<li>daecho : hi</li>
								</ul>
								<div>
											<div className="chat chat-start">
												<div className="chat-image avatar">
													<div className="w-10 rounded-full">
														<img src="./images/profile.jpeg" />
													</div>
												</div>
												<div className="chat-header">Obi-Wan Kenobi <time className="text-xs opacity-50">12:45</time></div>
												<div className="chat-bubble">You were the Chosen One!</div>
												<div className="chat-footer opacity-50">Delivered</div>
											</div>
											<div className="chat chat-end">
												<div className="chat-image avatar">
													<div className="w-10 rounded-full">
														<img src="./images/profile.jpeg" />
													</div>
												</div>
												<div className="chat-header">Anakin
													<time className="text-xs opacity-50">12:46</time>
												</div>
												<div className="chat-bubble">I hate you!</div>
												<div className="chat-footer opacity-50">Seen at 12:46</div>
											</div>
								</div>
							</div>
							<div className='chat-input'>
								<input type="text" placeholder="채팅을 입력하세요." className="input input-bordered input-accent w-full max-w-xs" />
								<button className="btn btn-active btn-primary">↵</button>
							</div>
						</section>
						<section className='swap-container'>
							{renderPage()}
						</section>
						<label htmlFor="my-drawer-4" className="drawer-button btn btn-primary">COMM<br></br>◀︎</label>
					</div> 
					<div className="drawer-side">
						<label htmlFor="my-drawer-4" className="drawer-overlay"></label>
						<ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
							<div className='button-side'>
								<button className={friendsButtonClass} onClick={() => handleButtonClick('friends_list')}>FRIENDS</button>
								<button className={channelsButtonClass} onClick={() => handleButtonClick('channels_list')}>CHANNELS</button>
							</div>
							{renderSide()}
							<div className='search-side'>
								<input type='text'></input>
								<button>🔍</button>
							</div>
						</ul>
					</div>
				</div>
			</div>
	);
}
