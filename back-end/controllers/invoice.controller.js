const Invoice = require('../models/invoice.model');

exports.createInvoice = async (req, res, next) => {
  try {
    const { UserID, TotalPrice, TicketID } = req.body;
    if (!UserID || !TotalPrice || !TicketID) {
      return res.status(400).json({ message: 'Missing required fields!' });
    }
    const invoice = new Invoice({ UserID, TotalPrice, TicketID });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
};


exports.getAllInvoice = async (req, res, next) => {
  try {
    const invoices = await Invoice.find().populate('UserID').populate({
        path: 'TicketID',
        populate: {
          path: 'ScreeningID',
          populate: [
            { path: 'MovieID' },
            { path: 'RoomID' },
            { path: 'ScreenTypeID' },
            { path: 'TimeSlotID' }
          ]
        }
      });
    invoices.sort((a, b) => b.createdAt - a.createdAt);
    res.json(invoices);
  } catch (err) {
    next(err);
  }
}; 