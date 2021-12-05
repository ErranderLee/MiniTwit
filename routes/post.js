const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isLoggedIn } = require('./middlewares');
const { Post } = require('../models');
const { nextTick } = require('process');

const router = express.Router();

try {
    fs.readdirSync('uploads');
  } catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  } // uploads 폴더 생성.

const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, 'uploads/'); // uploads 폴더에 이미지를 업로드.
      },
      filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        // 중복된 이름에 의한 덮어쓰기를 막기 위해서 날짜를 추가하여 저장함.
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB의 크기 제한.
  });
  
  router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
  });

  router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
      try {
          const post = await Post.create({
              content: req.body.content,
              img: req.body.url,
              UserId: req.user.id,
          });
          res.redirect('/');
      } catch (error) {
          console.error(error);
          next(error);
      }
  });

  module.exports = router;
