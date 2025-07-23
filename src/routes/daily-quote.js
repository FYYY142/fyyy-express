const express = require('express')
const router = express.Router()

// 每日一句API接口
router.get('/daily-quote', async (req, res) => {
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

module.exports = router
