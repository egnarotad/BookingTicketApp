const User = require('../models/user.model');

// Lấy thông tin user theo id
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate('PlaceID');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Cập nhật thông tin user
exports.updateUser = async (req, res, next) => {
    try {
        const { name, dob, mail, phone, placeId, avatar } = req.body;
        // Validate định dạng email nếu có truyền lên
        if (mail) {
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!emailRegex.test(mail)) {
                return res.status(400).json({ message: 'Invalid email format!' });
            }
        }
        // Validate định dạng số điện thoại nếu có truyền lên
        if (phone) {
            const phoneRegex = /^0\d{9}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ message: 'Invalid phone number format!' });
            }
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (name) user.Name = name;
        if (dob) user.DateofBirth = dob;
        if (mail) user.Mail = mail;
        if (phone) user.PhoneNumber = phone;
        if (placeId) user.PlaceID = placeId;
        if (avatar !== undefined) user.avatar = avatar;
        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        next(error);
    }
}; 