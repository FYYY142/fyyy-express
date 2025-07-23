// scripts/deploy.js
const fs = require('fs-extra')
const path = require('path')
const readline = require('readline')
const { execSync } = require('child_process')

// 当前 Express 项目的根目录
const sourceDir = path.resolve(__dirname, '..')

// 要部署到的目标目录
const deployDir = 'D:/VueProjects/fyyy-express'

// 时间格式函数
function getTimeString() {
  const now = new Date()
  return now.toISOString().replace('T', ' ').substring(0, 19)
}

// 命令行输入
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('请输入 commit 描述：', async (input) => {
  const time = getTimeString()
  const message = `${input} —— ${time}`

  try {
    console.log('✨ 正在清空目标目录（保留 .git）...')
    const items = await fs.readdir(deployDir)
    for (const item of items) {
      if (item !== '.git') {
        await fs.remove(path.join(deployDir, item))
      }
    }
    
    console.log('📁 复制项目到目标目录...')
    await fs.copy(sourceDir, deployDir, {
      filter: (src) => {
        const rel = path.relative(sourceDir, src)
        return !rel.startsWith('node_modules') &&
               !rel.startsWith('.git') && // 不复制 .git 是对的
               !rel.startsWith('dist') &&
               rel !== 'pnpm-lock.yaml' &&
               !rel.startsWith('.vscode') &&
               !rel.endsWith('.log')
      }
    })
    

    console.log('🚀 正在执行 Git 提交...')
    execSync(`git add .`, { cwd: deployDir, stdio: 'inherit' })
    execSync(`git commit -m "${message}"`, { cwd: deployDir, stdio: 'inherit' })
    execSync(`git push`, { cwd: deployDir, stdio: 'inherit' })

    console.log('✅ 部署完成！')
  } catch (err) {
    console.error('❌ 部署失败：', err)
  } finally {
    rl.close()
  }
})
