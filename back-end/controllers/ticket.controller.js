const Ticket = require('../models/ticket.model');

exports.createTicket = async (req, res, next) => {
  try {
    const { UserID, ScreeningID, SeatID, date } = req.body;
    if (!UserID || !ScreeningID || !SeatID || !date || !Array.isArray(SeatID) || SeatID.length === 0) {
      return res.status(400).json({ message: 'Missing required fields!' });
    }
    const ticket = new Ticket({ UserID, ScreeningID, SeatID, date });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
};

exports.getTicketsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: 'Missing userId' });
    const tickets = await Ticket.find({ UserID: userId }).populate('ScreeningID').populate('SeatID');
    // Sắp xếp vé mới nhất lên đầu
    tickets.sort((a, b) => b.createdAt - a.createdAt);
    res.json(tickets);
  } catch (err) {
    next(err);
  }
};

exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate({
        path: 'ScreeningID',
        populate: [
          { path: 'MovieID' },
          { path: 'RoomID' },
          { path: 'ScreenTypeID' },
          { path: 'TimeSlotID' }
        ]
      }).populate('SeatID');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    next(err);
  }
}; 