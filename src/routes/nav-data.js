const express = require('express')
const router = express.Router()
const supabase = require('../db/database')

// 统一处理导航数据的接口
router.post('/nav-data', async (req, res) => {
  const { type, id, name, url, icon, iconType } = req.body

  try {
    switch (type) {
      case 'create':
        const { data: createData, error: createError } = await supabase
          .from('nav_sites')
          .insert([{ name, url, icon, iconType }])
          .select()
        
        if (createError) {
          return res.status(500).json({ success: false, error: createError.message })
        }
        res.json({ success: true, id: createData[0].id })
        break

      case 'get':
        const { data: getData, error: getError } = await supabase
          .from('nav_sites')
          .select('*')
        
        if (getError) {
          return res.status(500).json({ success: false, error: getError.message })
        }
        res.json({ success: true, data: getData })
        break

      case 'update':
        const { data: updateData, error: updateError } = await supabase
          .from('nav_sites')
          .update({ name, url, icon, iconType })
          .eq('id', id)
          .select()
        
        if (updateError) {
          return res.status(500).json({ success: false, error: updateError.message })
        }
        res.json({ success: true, changes: updateData.length })
        break

      case 'delete':
        const { data: deleteData, error: deleteError } = await supabase
          .from('nav_sites')
          .delete()
          .eq('id', id)
          .select()
        
        if (deleteError) {
          return res.status(500).json({ success: false, error: deleteError.message })
        }
        res.json({ success: true, changes: deleteData.length })
        break

      default:
        res.status(400).json({ success: false, error: 'Invalid type' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
