DROP TABLE IF EXISTS violog;
DROP TABLE IF EXISTS commentattitude;
DROP TABLE IF EXISTS postattitude;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS user;

CREATE TABLE user (
  uid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  nickname VARCHAR(41) UNIQUE KEY NOT NULL,
  email VARCHAR(41),
  createDate TIMESTAMP,
  password TEXT NOT NULL,
  status INT
);

CREATE TABLE post(
  pid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  uid INT,
  content TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status INT DEFAULT 1,
  FOREIGN KEY (uid) REFERENCES user (uid)
);

CREATE TABLE comment(
  cid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  pid INT NOT NULL,
  uid INT NOT NULL,
  touid INT NOT NULL,
  content TEXT,
  date TIMESTAMP,
  status INT,
  FOREIGN KEY (uid) REFERENCES user(uid),
  FOREIGN KEY (uid) REFERENCES user(uid),
  FOREIGN KEY (pid) REFERENCES post(pid)
);

CREATE TABLE postattitude(
  paid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  pid INT NOT NULL,
  uid INT NOT NULL,
  date TIMESTAMP,
  attitude INT NOT NULL COMMENT 'support 1, against 2',
  FOREIGN KEY (pid) REFERENCES post(pid),
  FOREIGN KEY (uid) REFERENCES user(uid)
);

CREATE TABLE commentattitude(
  caid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  cid INT NOT NULL,
  uid INT NOT NULL,
  date TIMESTAMP,
  attitude INT NOT NULL COMMENT 'support 1, against 2',
  FOREIGN KEY (cid) REFERENCES comment(cid),
  FOREIGN KEY (uid) REFERENCES user(uid)
);

CREATE TABLE violog(
  uid INT,
  cid INT,
  pid INT,
  type INT COMMENT '1: new user, 2: new post, 3: new comment, 4: new post attitude, 5: new comment attitude, 6: delete user, 7: delete post, 8: delete comment',
  action TEXT,
  date TIMESTAMP,
  lid INT PRIMARY KEY NOT NULL AUTO_INCREMENT
);