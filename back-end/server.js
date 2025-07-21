const express = require('express');
const connectDB = require('./connect/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
require('dotenv').config();
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Express web server.' });
});
const accountRoute = require('./routes/account.route');
const userRoute = require('./routes/user.route');
const movieRoute = require('./routes/movie.route');
const seatRoute = require('./routes/seat.route');
const placeRoute = require('./routes/place.route');
const cinemaRoute = require('./routes/cinema.route');
const screeningRoute = require('./routes/screening.route');
const timeslotRoute = require('./routes/timeslot.route');
const screenTypeRoute = require('./routes/screenType.route');
const roomRoute = require('./routes/room.route');
const ticketRoute = require('./routes/ticket.route');
const invoiceRoute = require('./routes/invoice.route');
const statusRoute = require('./routes/status.route');
const uploadRoute = require('./routes/upload.route');
const genreRouter = require('./routes/genre.route');
const seatStatusRouter = require('./routes/seatStatus.route');
app.use('/api/accounts', accountRoute);
app.use('/api/users', userRoute);
app.use('/api/movies', movieRoute);
app.use('/api/seats', seatRoute);
app.use('/api/places', placeRoute);
app.use('/api/cinemas', cinemaRoute);
app.use('/api/screenings', screeningRoute);
app.use('/api/timeslots', timeslotRoute);
app.use('/api/screentypes', screenTypeRoute);
app.use('/api/rooms', roomRoute);
app.use('/api/tickets', ticketRoute);
app.use('/api/invoices', invoiceRoute);
app.use('/api/status', statusRoute);
app.use('/api/upload', uploadRoute);
app.use('/uploads', express.static('uploads')); // Cho phép truy cập file tĩnh
app.use('/api/genres', genreRouter);
app.use('/api/seat-status', seatStatusRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 9999;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running at: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();