const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => { // auth.js 에서 req.login 하면 index.js로 온다.
        done(null, user.id); // 세션에 user의 id만 저장. done 되는 순간 auth.js로 돌아가 나머지 코드가 실행.
    });

    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id }})
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local();
    kakao();
};