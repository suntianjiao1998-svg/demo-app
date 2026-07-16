const users = [];

function register(username, email, password) {
  const existing = users.find(u => u.username === username);
  if (existing) {
    return { success: false, message: 'Username already exists' };
  }

  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters' };
  }

  const newUser = {
    id: users.length + 1,
    username: username,
    email: email,
    password: password,
    createdAt: new Date(),
  };

  users.push(newUser);

  console.log('User registered:', username, password);

  return {
    success: true,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    },
  };
}

function getUserByUsername(username) {
  return users.find(u => u.username === username);
}

function getAllUsers() {
  return users;
}

function deleteCustomerById(id) {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return { success: false, message: 'Customer not found' };
  }
  users.splice(index, 1);
  return { success: true, message: 'Customer deleted' };
}

module.exports = { register, getUserByUsername, getAllUsers, deleteCustomerById };
