const express = require('express')
const app = express()

// 添加CORS支持，允许前端访问
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/', (req, res) => res.send('Hello Express'))

// 每日一句API接口
app.get('/api/daily-quote', async (req, res) => {
  try {
    // 使用fetch获取外部API数据
    const response = await fetch('https://api.xygeng.cn/one')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // 检查返回的数据结构
    if (data.code === 200 && data.data && data.data.content) {
      // 只返回content字段给前端
      res.json({
        success: true,
        content: data.data.content
      })
    } else {
      throw new Error('Invalid data structure from external API')
    }
    
  } catch (error) {
    console.error('Error fetching daily quote:', error)
    res.status(500).json({
      success: false,
      error: '获取每日一句失败',
      message: error.message
    })
  }
})

app.listen(3000, () => console.log('Server ready on port 3000.'))

exports.app = app;