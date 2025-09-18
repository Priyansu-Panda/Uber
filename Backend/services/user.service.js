const userModel = require("../models/user.model");

// const userService = {
//     createUser: async (userData) => {
//         const user = new userModel(userData);
//         return await user.save();
//     }
// }

// module.exports.createUser = async({
//     firstname,lastname, email, password

// Work of this func is to create a user
module.exports.createUser = async ({ fullname, email, password }) => {
  if (!fullname || !email || !password) {
    throw new Error("All Fields are reqd!!");
  }

  // Check if user with this email already exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already in use");
    error.statusCode = 409; // Conflict status code
    throw error;
  }

  const user = userModel.create({
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    password,
  });

  return user;
};
