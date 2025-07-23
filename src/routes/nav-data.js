const express = require('express')
const router = express.Router()
const db = require('../db/database')

// 统一处理导航数据的接口
router.post('/nav-data', (req, res) => {
  const { type, id, name, url, icon, iconType } = req.body

  switch (type) {
    case 'create':
      db.run('INSERT INTO nav_sites (name, url, icon, iconType) VALUES (?, ?, ?, ?)', [name, url, icon, iconType], function(err) {
        if (err) {
          return res.status(500).json({ success: false, error: err.message })
        }
        res.json({ success: true, id: this.lastID })
      })
      break

    case 'get':
      db.all('SELECT * FROM nav_sites', [], (err, rows) => {
        if (err) {
          return res.status(500).json({ success: false, error: err.message })
        }
        res.json({ success: true, data: rows })
      })
      break

    case 'update':
      db.run('UPDATE nav_sites SET name = ?, url = ?, icon = ?, iconType = ? WHERE id = ?', [name, url, icon, iconType, id], function(err) {
        if (err) {
          return res.status(500).json({ success: false, error: err.message })
        }
        res.json({ success: true, changes: this.changes })
      })
      break

    case 'delete':
      db.run('DELETE FROM nav_sites WHERE id = ?', [id], function(err) {
        if (err) {
          return res.status(500).json({ success: false, error: err.message })
        }
        res.json({ success: true, changes: this.changes })
      })
      break

    default:
      res.status(400).json({ success: false, error: 'Invalid type' })
  }
})

module.exports = router
