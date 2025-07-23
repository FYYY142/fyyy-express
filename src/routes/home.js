const express = require('express')
const router = express.Router()

// 根路径接口
router.get('/', (req, res) => res.send('Hello Express'))

module.exports = router
