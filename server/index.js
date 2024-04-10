import http from 'http';
import 'dotenv/config'
import './logger.js'
import express from 'express';
import cors from 'cors'
import path from 'path';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import './db.js'
import os from 'os'

function getIPAddress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }
  return '0.0.0.0';
}

const app = express();
const server = http.Server(app)

app.use(cors())
app.use(bodyParser.json());

process.env.TOKEN_SECRET = '6ffda691-5b98-4c3f-a955-9c88559f5e37'

let sendVue = (res) => res.sendFile(path.resolve('../dist/index.html'))

app.use((req,res, next) => {
  console.log(req.method, req.path)
  next()
})

app.use(routes)

app.use(express.static(path.resolve('./uploads')));
app.use(express.static(path.resolve('../dist')));
app.get(/.*/,(req,res)=> sendVue(res))

server.listen(80, ()=> console.log(`App running on http://localhost / http://${getIPAddress()}`))
