// This is just so repl.it will keep the bot running
const express = require('express');
const server = express();

server.all('/', (req, res)=>{
	res.send('Discord PinBoard<br /><a href="https://discord.com/api/oauth2/authorize?client_id=809803000066867225&permissions=8192&scope=bot">Invite</a>');
})

function keepAlive(){
	server.listen(3000, ()=>{console.log('Server is Ready!')});
}

module.exports = keepAlive;