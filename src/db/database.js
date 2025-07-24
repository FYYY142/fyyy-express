const { createClient } = require('@supabase/supabase-js')

// Supabase配置
const supabaseUrl = 'https://wgfwqqsjqvrhhzerqqat.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnZndxcXNqcXZyaGh6ZXJxcWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNDY4NzgsImV4cCI6MjA2ODkyMjg3OH0.rW5todNpCGU5zoU5uDbT6ZH9ET5OhSY313vL74-ui18"

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

// 导出Supabase客户端
module.exports = supabase
