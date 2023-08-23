import axios from 'axios'



export const where = (socket, nickname:string) => {
	axios.get('http://localhost:3001/users/nickname/' + nickname)
		.then(response => {
			socket.emit('where', response.data.nickname);
			return new Promise((resolve, reject) => {
				socket.on('where', (channel) => {
				  resolve(channel);
				});
			
				setTimeout(() => {
				  reject(new Error('채널 정보를 불러올 수 없습니다.'));
				}, 5000);
			  });
		})
		.catch(error => {
			console.log(error);
		})
	return null;
};