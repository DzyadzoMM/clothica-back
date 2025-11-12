import { User } from '../models/user.js';

export const getCurrentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCurrentUser = async (req, res) => {
  try {
    const allowedFields = [
      'firstName',
      'lastName',
      'phone',
      'city',
      'postOfficeNum',
    ];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'Немає даних для оновлення' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};
