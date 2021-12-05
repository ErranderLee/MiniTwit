const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config(); // 이 코드 아래로 config 가 적용되므로 가장 위로 올려주는 것이 좋다.
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const { sequelize } = require('./models'); 
const passportConfig = require('./passport');
const exp = require('constants');
const app = express();
app.set('port', process.env.PORT || 8001); // process.env.PORT를 붙인 이유? 배포할 때 설정(.env)해서 넣어주기 위해.
app.set('view engine', 'html');
nunjucks.configure('views', { // views는 템플릿 파일이 위치한 폴더
    express: app, // express와 연결
    watch: true, // html 파일이 변경될 때 마다 템플릿 엔진 다시 렌더링
}); // nunjuncks는 템플릿 엔진. 설정하는 부분.
sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    })
passportConfig(); // passport 연결.

app.use(morgan('dev')); // 로깅 모듈 morgan
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일을 제공하는 폴더
app.use('/img', express.static(path.join(__dirname, 'uploads'))); // /img에 요청을 하면 uploads의 이미지를 가져감.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error); // 에러 미들웨어로 넘겨준다.    
}); // 404 처리 미들웨어

app.use((err, req, res, next) => { // 에러 미들웨어 인자가 네 개인 것이 특성. next를 반드시 넣어야 함.
    res.locals.message = err.message; // 템플릿 엔진에서 message 라는 변수를 쓸 수 있게 해준다.
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 개발 모드일 때는 에러 스택을 보여주고 배포모드일 때는 안 보여줌.
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});