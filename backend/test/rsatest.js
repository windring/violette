const crypto = require('crypto');
const { publicKey, privateKey } = require('../config/rsa');
const data = 'abcdefg';
const enbase64 = crypto.publicEncrypt(publicKey, Buffer.from(data,'utf-8')).toString('base64');
const dedata = crypto.privateDecrypt(privateKey, Buffer.from(enbase64, 'base64')).toString('utf-8');
console.log(data,enbase64,dedata);
console.log(data === dedata);