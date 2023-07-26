import React from 'react'
import '../css/LeaderBoard.css'

export default function LeaderBoard() {
  return (
	<div className='leaderboard-container'>
		<ul>
			<li className='ranklist'>
				<div className='rank' style={{color:'gold'}}>1</div>
				<div className='nickname'>daechoi</div>
				<div className='number'>30전 20승 10패</div>
				<div className='ratio'>66.6%</div>
			</li>
			<li className='ranklist'>
				<div className='rank' style={{color:'silver'}}>2</div>
				<div className='nickname'>김두한</div>
				<div className='number'>30전 10승 20패</div>
				<div className='ratio'>33.3%</div>
			</li>
			<li className='ranklist'>
				<div className='rank' style={{color:'#af6114'}}>3</div>
				<div className='nickname'>김두한</div>
				<div className='number'>10전 10승 0패</div>
				<div className='ratio'>100%</div>
			</li>
		</ul>
	</div>
  )
}
