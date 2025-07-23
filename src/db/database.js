const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// 数据库文件路径
const dbPath = path.resolve(__dirname, 'nav_data.db')

// 连接数据库 (如果不存在则创建)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message)
  } else {
    console.log('Connected to the SQLite database.')
    // 创建表 (如果不存在)
    db.run(`CREATE TABLE IF NOT EXISTS nav_sites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT NOT NULL,
      iconType TEXT NOT NULL CHECK(iconType IN ('img', 'svg'))
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err.message)
      }
    })
  }
})

module.exports = db
