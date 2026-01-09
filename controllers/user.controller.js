import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); //all fields except password

    if (!user) {
      const error = new Error("User Not Found");
      error.status = 404;
      throw error;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const {name, email} = req.body;
    
    // Check if user exists before updating
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error("User Not Found");
      error.status = 404;
      throw error;
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      const error = new Error("User Not Found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
     next(error);
  }
};
