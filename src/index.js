const express = require('express')
const app = express()

// 引入路由文件
const homeRouter = require('./routes/home')
const dailyQuoteRouter = require('./routes/daily-quote')
const navDataRouter = require('./routes/nav-data')

// 中间件
app.use(express.json()) // 解析JSON请求体

// 添加CORS支持，允许前端访问
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// 使用路由
app.use('/', homeRouter)
app.use('/api', dailyQuoteRouter)
app.use('/api', navDataRouter)

app.listen(3000, () => console.log('Server ready on port 3000.'))

exports.app = app;