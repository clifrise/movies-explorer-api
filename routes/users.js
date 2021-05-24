const router = require('express').Router();
const { validateGetLoggedInUser, validateUpdateUser } = require('../middlewares/validators');
const { getLoggedInUser, updateUser } = require('../controllers/users');

router.get('/me', validateGetLoggedInUser, getLoggedInUser);

router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
