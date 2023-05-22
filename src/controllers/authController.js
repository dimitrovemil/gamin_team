const router = require('express').Router();

const authService = require('../services/authService');
const { cookieSessionName } = require('../config/constants');
const { isAuth, isLogged } = require('../middlewares/authMiddleware');
const { getErrorMessage} = require('../utils/errorHelpers');

router.get('/register', isLogged, (req, res) => {
    res.render('auth/register')
});

router.post('/register', isLogged, async (req, res) => {
    try {
        await authService.register(req.body);

        res.redirect('/');
    } catch (error) {
        res.status(401).render('auth/register', { error: getErrorMessage(error) });
    }
});

router.get('/login', isLogged, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isLogged, async (req, res) => {
    try {
        let user = await authService.login(req.body);
        let token = await authService.createToken(user);

        if (!token) {
            res.redirect('/404');
        }

        res.cookie(cookieSessionName, token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        res.status(401).render('auth/login', { error: error.message });
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(cookieSessionName);
    res.redirect('/');
})

module.exports = router;