'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
//NODE_ENV값이 없으면 'development'를 값으로 가진다.
const config = require(__dirname + '/../config/config.json')[env];
//config/config.json 에서 env 값에 해당하는 데이터를 가져온다.

const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');
const { Hash } = require('crypto');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);
// 설정들을 연결해 연결객체를 만든다.

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);

module.exports = db;
