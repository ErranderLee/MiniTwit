

const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const express = require('express');
const router = express.Router();

router.post('/join', async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email }});
        if(exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12); // 12는 얼마나 암호화를 복잡하게 할 것인지.
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        return res.redirect(`/?loginError=${info.message}`);
      }
      return req.login(user, (loginError) => { 
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        // 세션 쿠키를 브라우저로 보내줌.
        return res.redirect('/');
        // 세션 쿠키가 브라우저에 들어가서 요청을 보낼 때마다 서버가 누군지 알 수 있음.
      });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
  });

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout(); // 세션 쿠키가 사라짐. 서버에서 세션 쿠키를 지워져 로그인이 풀린다.
    req.session.destroy(); // 세션을 파괴.
    res.redirect('/');
  });
  
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});
module.exports = router;