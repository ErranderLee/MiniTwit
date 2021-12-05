const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    next();
});

router.get('/profile', (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird', user: req.user, });
});

router.get('/join', (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']],
        }); // Post와 User 테이블을 join 하여 Post에 해당하는 User의 id와 nick 만 보여줌.
        res.render('main', {
            user: res.locals.user,
            title: 'NodeBird',
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;