import EncryptedStorage from 'react-native-encrypted-storage';

// Helper lấy token từ EncryptedStorage
const getToken = async () => {
  const stored = await EncryptedStorage.getItem('auth');
  // nếu có dữ liệu thì parse về json và lấy token
  if (stored) {
    const { token } = JSON.parse(stored);
    return token;
  }
  // không có dữ liệu trả về null
  return null;
};

// ===================== ACCOUNT =====================
export const getAccounts = async () => {
  const token = await getToken();
  return fetch('http://10.0.2.2:9999/api/accounts', {
    headers: { Authorization: 'Bearer ' + token }
  }).then(res => res.json());
};

export const loginAccount = (phone, password) => fetch('http://10.0.2.2:9999/api/accounts/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone, password })
}).then(res => res.json().then(data => ({ ok: res.ok, data })));

export const registerAccount = (payload) => fetch('http://10.0.2.2:9999/api/accounts/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
}).then(res => res.json().then(data => ({ ok: res.ok, data })));

export const uploadAvatar = async (formData) => {
  const token = await getToken();
  return fetch('http://10.0.2.2:9999/api/upload/avatar', {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  }).then(res => res.json());
};

export const deleteAvatar = async (url) => {
  const token = await getToken();
  return fetch('http://10.0.2.2:9999/api/upload/avatar', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ url }),
  }).then(res => res.json());
};

// ===================== USER =====================
export const getUserById = async (userId) => {
  const token = await getToken();
  return fetch(`http://10.0.2.2:9999/api/users/${userId}`, {
    headers: { Authorization: 'Bearer ' + token }
  }).then(res => res.json());
};

export const updateUser = async (userId, payload) => {
  const token = await getToken();
  return fetch(`http://10.0.2.2:9999/api/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(payload)
  }).then(res => res.json().then(data => ({ ok: res.ok, data })));
};

// ===================== MOVIE =====================
export const getMovies = () => fetch('http://10.0.2.2:9999/api/movies').then(res => res.json());

export const getActiveMovies = () => fetch('http://10.0.2.2:9999/api/movies/active').then(res => res.json());

export const getUpcomingMovies = () => fetch('http://10.0.2.2:9999/api/movies/upcoming').then(res => res.json());

export const getMovieById = (id) => fetch(`http://10.0.2.2:9999/api/movies/${id}`).then(res => res.json());

export const createMovie = (payload) => fetch('http://10.0.2.2:9999/api/movies', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});

export const updateMovie = async (id, payload) => {
  const token = await getToken();
  return fetch(`http://10.0.2.2:9999/api/movies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(payload)
  }).then(res => res.json().then(data => ({ ok: res.ok, data }))); //trả về object gồm trạng thái của res và data từ server
};

export const searchMovies = (keyword) => fetch(`http://10.0.2.2:9999/api/movies/search?name=${encodeURIComponent(keyword)}`).then(res => res.json());

// ===================== TICKET =====================
export const getTicketsByUser = async (userId) => {
  const token = await getToken();
  return fetch(`http://10.0.2.2:9999/api/tickets/user/${userId}`, {
    headers: { Authorization: 'Bearer ' + token }
  }).then(res => res.json());
};

export const getTicketById = (ticketId) => fetch(`http://10.0.2.2:9999/api/tickets/${ticketId}`).then(res => res.json());

export const createTicket = async (payload) => {
  const token = await getToken();
  return fetch('http://10.0.2.2:9999/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(payload)
  }).then(res => res.json());
};

// ===================== INVOICE =====================
export const getInvoices = async () => {
  const token = await getToken();
  return fetch('http://10.0.2.2:9999/api/invoices', {
    headers: { Authorization: 'Bearer ' + token }
  }).then(res => res.json());
};

export const createInvoice = async (payload) => {
  const token = await getToken();
  return fetch('http://10.0.2.2:9999/api/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(payload)
  }).then(res => res.json());
};

// ===================== SEAT =====================
export const getSeats = () => fetch('http://10.0.2.2:9999/api/seats').then(res => res.json());

export const getSeatsByRoom = (roomId) => fetch(`http://10.0.2.2:9999/api/seats/by-room/${roomId}`).then(res => res.json());

export const addSeatToRoom = async (seatId, roomId) => {
  const token = await getToken();
  return fetch(`http://10.0.2.2:9999/api/seats/${seatId}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ RoomID: roomId })
  }).then(res => ({ ok: res.ok, status: res.status }));
};

export const removeSeatFromRoom = async (seatId, roomId) => {
  const token = await getToken();
  return fetch(`http://10.0.2.2:9999/api/seats/${seatId}/rooms`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ RoomID: roomId })
  }).then(res => ({ ok: res.ok, status: res.status }));
};

// ===================== ROOM =====================
export const getRooms = () => fetch('http://10.0.2.2:9999/api/rooms').then(res => res.json());

export const getRoomById = (roomId) => fetch(`http://10.0.2.2:9999/api/rooms/${roomId}`).then(res => res.json());

export const updateRoomStatus = async (roomId, statusId) => {
  const token = await getToken();
  return fetch(`http://10.0.2.2:9999/api/rooms/${roomId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ statusId })
  });
};

export const createRoom = async (payload) => {
  const token = await getToken();
  return fetch('http://10.0.2.2:9999/api/rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(payload)
  });
};

// ===================== CINEMA =====================
export const getCinemas = () => fetch('http://10.0.2.2:9999/api/cinemas/all').then(res => res.json());

export const getCinemasByPlace = (placeId) => fetch(`http://10.0.2.2:9999/api/cinemas?placeId=${placeId}`).then(res => res.json());

export const createCinema = async (payload) => {
  const token = await getToken();
  return fetch('http://10.0.2.2:9999/api/cinemas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(payload)
  });
};

export const updateCinema = async (cinemaId, payload) => {
  const token = await getToken();
  return fetch(`http://10.0.2.2:9999/api/cinemas/${cinemaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(payload)
  });
};

export const updateCinemaStatus = async (cinemaId, statusId) => {
  const token = await getToken();
  return fetch(`http://10.0.2.2:9999/api/cinemas/${cinemaId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ statusId })
  });
};

// ===================== SCREENING =====================
export const getScreenings = () => fetch('http://10.0.2.2:9999/api/screenings').then(res => res.json());

export const getScreeningById = (id) => fetch(`http://10.0.2.2:9999/api/screenings/${id}`).then(res => res.json());

export const getScreeningsByMovieId = (movieId) => fetch(`http://10.0.2.2:9999/api/screenings/by-movie/${movieId}`).then(res => res.json());

export const createScreening = async (payload) => {
  const token = await getToken();
  return fetch('http://10.0.2.2:9999/api/screenings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(payload)
  });
};

export const updateScreening = async (id, payload) => {
  const token = await getToken();
  return fetch(`http://10.0.2.2:9999/api/screenings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(payload)
  });
};

// ===================== STATUS =====================
// lấy về tất cả status
export const getStatusList = () => fetch('http://10.0.2.2:9999/api/status').then(res => res.json());

export const createStatus = async (payload) => {
  const token = await getToken();
  return fetch('http://10.0.2.2:9999/api/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(payload)
  });
};

// ===================== PLACE =====================
export const getPlaces = () => fetch('http://10.0.2.2:9999/api/places').then(res => res.json());

// ===================== SCREENTYPE =====================
export const getScreenTypes = () => fetch('http://10.0.2.2:9999/api/screentypes').then(res => res.json());

export const getScreenTypeById = (id) => fetch(`http://10.0.2.2:9999/api/screentypes/${id}`).then(res => res.json());

// ===================== TIMESLOT =====================
export const getTimeSlots = () => fetch('http://10.0.2.2:9999/api/timeslots').then(res => res.json());

export const getTimeSlotById = (id) => fetch(`http://10.0.2.2:9999/api/timeslots/${id}`).then(res => res.json());

// ===================== GENRE =====================
export const getGenres = () => fetch('http://10.0.2.2:9999/api/genres').then(res => res.json());

export const createGenre = async (payload) => {
  const token = await getToken();
  return fetch('http://10.0.2.2:9999/api/genres', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(payload)
  });
};

// ===================== SEATSTATUS =====================
export const getSeatStatusByScreening = (screeningId) => fetch(`http://10.0.2.2:9999/api/seat-status/by-screening/${screeningId}`).then(res => res.json());

export const updateSeatStatus = (id, statusId) => fetch(`http://10.0.2.2:9999/api/seat-status/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ StatusID: statusId })
}).then(res => res.json());