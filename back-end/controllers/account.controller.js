const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Account = require('../models/account.model');
const User = require('../models/user.model');

// Đăng ký tài khoản mới (tạo user + account)
exports.register = async (req, res, next) => {
    try {
        const { name, dob, mail, phone, placeId, password, role = 'user', statusId } = req.body;
        // Validate email
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(mail)) {
            return res.status(400).json({ message: 'Invalid email format!' });
        }
        // Validate phone number bắt đầu với 0 và có 10 số
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: 'Invalid phone number format!' });
        }
        // Check user existed
        let user = await User.findOne({ PhoneNumber: phone });
        if (user) {
            return res.status(400).json({ message: 'User with this phone number already exists!' });
        }
        // Check email existed
        user = await User.findOne({ Mail: mail });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists!' });
        }
        // Tạo user mới
        user = new User({
            Name: name,
            DateofBirth: dob,
            Mail: mail,
            PhoneNumber: phone,
            PlaceID: placeId
        });
        await user.save();
        // Hash password
        const hashPassword = await bcryptjs.hash(password, 10);
        // Tạo account mới
        const newAccount = new Account({ UserID: user._id, Password: hashPassword, Role: role, StatusID: statusId });
        await newAccount.save();
        res.status(201).json({ message: 'Register successful!' });
    } catch (error) {
        next(error);
    }
};

// Đăng nhập: kiểm tra phonenumber và password, trả về JWT
exports.login = async (req, res, next) => {
    try {
        const { phone, password } = req.body;
        // Tìm user theo phone
        const user = await User.findOne({ PhoneNumber: phone });
        if (!user) {
            return res.status(401).json({ message: 'Phone number or password is incorrect!' });
        }
        // Tìm account theo userID
        const account = await Account.findOne({ UserID: user._id });
        if (!account) {
            return res.status(401).json({ message: 'Phone number or password is incorrect!' });
        }
        // So sánh password
        const isMatch = await bcryptjs.compare(password, account.Password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Phone number or password is incorrect!' });
        }
        // Tạo JWT
        const token = jwt.sign(
            { userId: user._id, role: account.Role },
            process.env.JWT_KEY || 'secret_key',
            { algorithm: 'HS256', expiresIn: '7d' }
        );
        res.status(200).json({ message: 'Login successful', role: account.Role.toLowerCase(), token, userId: user._id });
    } catch (error) {
        next(error);
    }
};

exports.getAllAccounts = async (req, res, next) => {
    try {
        const accounts = await Account.find({}, '_id Role StatusID').populate('StatusID');
        res.json(accounts);
    } catch (error) {
        next(error);
    }
}; 