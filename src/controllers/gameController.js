const router = require('express').Router();

const { getErrorMessage } = require('../utils/errorHelpers');

const { isAuth } = require('../middlewares/authMiddleware');

const gameService = require('../services/gameService');


router.get('/', async (req, res) => {
    const games = await gameService.getAll().lean()

    res.render('catalog', { games });
});

router.get('/create', isAuth, (req, res) => {
    res.render('game/create');
});

router.post('/create', isAuth, async (req, res) => {
    const gameData = { ...req.body, owner: req.user._id };

    try {
        await gameService.create(gameData);

        res.redirect('/catalog');
    } catch (error) {
        res.render('game/create', { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/:gameId/details', async (req, res) => {
    const game = await gameService.getOneDetailed(req.params.gameId).lean();

    const isOwner = game.owner._id == req.user?._id;
    const bought = game.boughtBy.some(x => x._id == req.user?._id);

    res.render('game/details', { ...game, isOwner, bought });
});

router.get('/:gameId/buy', isAuth, async (req, res) => {
    const game = await gameService.getOne(req.params.gameId);

    game.boughtBy.push(req.user._id);

    await game.save();

    res.redirect(`/catalog/${req.params.gameId}/details`);
});

router.get('/:gameId/edit', isAuth, async (req, res, next) => {
    const game = await gameService.getOne(req.params.gameId).lean();
    const isOwner = game.owner._id == req.user?._id;

    game.options= createOptions(game.platform);

    if (!isOwner) {
        return next({ message: `You're not authorized`, status: 401 });
    }

    // res.render('game/edit', { ...game } );
    res.render('game/edit', Object.assign(game, { title: 'Edit Auction', auctionTitle: game.title } ));
});

router.post('/:gameId/edit', isAuth, async (req, res, next) => {
    const game = await gameService.getOne(req.params.gameId).lean();
    const isOwner = game.owner._id == req.user?._id;

    if (!isOwner) {
        return next({ message: `You're not authorized`, status: 401 });
    }
    

    try {
        await gameService.update(req.params.gameId, req.body);

        res.redirect(`/catalog/${req.params.gameId}/details`);
    } catch (error) {
        res.render(`game/edit`, { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/:gameId/delete', isAuth, async (req, res, next) => {
    const game = await gameService.getOne(req.params.gameId).lean();
    const isOwner = game.owner._id == req.user?._id;

    if (!isOwner) {
        return next({ message: `You're not authorized`, status: 401 });
    }

    await gameService.delete(req.params.gameId);

    res.redirect('/catalog');
});

router.get('/search', async (req, res) => {
    let { name, platform } = req.query;
    const games = await gameService.search(name, platform);

    res.render('search', { games, name, platform });
});


function createOptions(category) {
    return [
        { content: 'PC', value: 'PC' },
        { content: 'Nintendo', value: 'Nintendo' },
        { content: 'PS4', value: 'PS4' },
        { content: 'PS5', value: 'PS5' },
        { content: 'XBOX', value: 'XBOX' },
    ].map((x, i) => (x.value === category ? { ...x, selected: 'selected' } : x));
}

module.exports = router;