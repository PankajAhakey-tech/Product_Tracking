const router = require('express').Router();

const user = require('./src/user/user.router.js')
const admin = require('./src/admin/admin.router.js')

router.use('/user',user);
router.use('/admin',admin);


module.exports = router;