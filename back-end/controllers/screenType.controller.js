const ScreenType = require('../models/screenType.model');

exports.getAllScreenTypes = async (req, res, next) => {
  try {
    const screenTypes = await ScreenType.find();
    res.status(200).json(screenTypes);
  } catch (err) {
    next(err);
  }
};

exports.getScreenTypeById = async (req, res, next) => {
  try {
    const screenType = await ScreenType.findById(req.params.id);
    if (!screenType) return res.status(404).json({ message: 'ScreenType not found' });
    res.status(200).json(screenType);
  } catch (err) {
    next(err);
  }
}; 