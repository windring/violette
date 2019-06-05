# violette

### demo

http://123.57.61.222:4001

### how to config?

```
mv backend/config/mysql.js.bk backend/config/mysql.js
mv backend/config/rsa.js.bk backend/config/rsa.js
mv frontend/src/config/rsa.js.bk frontend/src/config/rsa.js
mv frontend/src/config/url.js.bk frontend/src/config/url.js
```

and then modify these files.

### how to start?

init database

```
mysql -u<yourusername> -p<yourpassword> -D<yourdatabase> < database/init.sql 
```

start backend

```
# cd backend
pm2 --name backend start npm -- run dev
```

start frontend

```
# cd frontend
pm2 --name frontend start npm -- run dev
```