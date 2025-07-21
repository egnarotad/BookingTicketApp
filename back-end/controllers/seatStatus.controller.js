const SeatStatus = require('../models/seatStatus.model');
const Status = require('../models/status.model');

// Lấy tất cả trạng thái ghế của một screening
exports.getSeatStatusByScreening = async (req, res, next) => {
  try {
    const { screeningId } = req.params;
    if (!screeningId) return res.status(400).json({ message: 'Missing screeningId param' });
    const seatStatuses = await SeatStatus.find({ ScreeningID: screeningId }).populate('SeatID').populate('StatusID');
    res.status(200).json(seatStatuses);
  } catch (err) {
    next(err);
  }
};

// Cập nhật trạng thái ghế (PATCH)
exports.updateSeatStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { StatusID } = req.body;
    if (!StatusID) return res.status(400).json({ message: 'Missing StatusID' });
    const seatStatus = await SeatStatus.findByIdAndUpdate(id, { StatusID }, { new: true }).populate('SeatID').populate('StatusID');
    if (!seatStatus) return res.status(404).json({ message: 'SeatStatus not found' });
    res.status(200).json(seatStatus);
  } catch (err) {
    next(err);
  }
};