const MANAGEMENT_USER = {
  user_id: 'admin',
  password: 'admin123',
  name: 'Management Admin'
};

async function managementLogin(req, res) {
  const { user_id, password } = req.body;
  if (
    user_id === MANAGEMENT_USER.user_id &&
    password === MANAGEMENT_USER.password
  ) {
    return res.status(200).json({
      message: `Welcome, ${MANAGEMENT_USER.name}!`,
      user: { user_id: MANAGEMENT_USER.user_id, name: MANAGEMENT_USER.name }
    });
  }
  return res.status(400).json({ message: 'Invalid management credentials' });
}

module.exports = { managementLogin };
