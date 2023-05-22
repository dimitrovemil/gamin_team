const Game = require('../models/Game')

exports.getAll = () => Game.find();

exports.getOneDetailed = (gameId) => Game.findById(gameId).populate('boughtBy');

exports.getOne = (gameId) => Game.findById(gameId);

exports.delete = (gameId) => Game.findByIdAndDelete(gameId);

exports.create = (gameData) => Game.create(gameData);

exports.update = (gameId, updatedGameData) => Game.findByIdAndUpdate(gameId, updatedGameData, { runValidators: true });


// exports.search = async (name = '', platform) => {
//     let games = await Game.find({ $or: [{ name: { $regex: `${name}`, $options: 'i' } }, { platform: platform }] }).lean();

//     return games;
// };

exports.search = async (name = '', platform = '') => {
    let games = await Game.find({
        $and:
            [
                { name: { $regex: new RegExp(name, 'i') } },
                { platform: { $regex: new RegExp(platform, 'i') } },

            ]
    }).lean();

    return games;
};


