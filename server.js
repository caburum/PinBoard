// This is just so repl.it will keep the bot running
const express = require('express');
const server = express();

server.all('/', (req, res)=>{
  res.send('Discord PinBot');
})

function keepAlive(){
  server.listen(3000, ()=>{console.log('Server is Ready!')});
}

module.exports = keepAlive;