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

// 获取最近 24 小时的提交信息（只保留 commit message 本身）
let suggestedCommit = ''
try {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  suggestedCommit = execSync(`git log --since="${since}" -1 --pretty=format:"%s"`, {
    cwd: sourceDir
  }).toString().trim()
} catch (err) {
  console.error('⚠️ 获取最近提交失败喵：', err)
}

// 命令行输入
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('\n📌 推荐的 commit 描述如下喵（已自动填入）:\n')
console.log(suggestedCommit || '（无）')

rl.question('\n请输入 commit 描述喵（可直接修改建议内容）：\n> ', async (input) => {
  const time = getTimeString()
  const userInput = input.trim() || suggestedCommit || 'manual commit'
  const message = `${userInput} —— ${time}`

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
               !rel.startsWith('.git') &&
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

    console.log(`✅ 部署完成喵！已提交：${message}`)
  } catch (err) {
    console.error('❌ 部署失败喵：', err)
  } finally {
    rl.close()
  }
})

// 将建议内容写入输入框（真正填进去，可以删）
if (suggestedCommit) {
  setTimeout(() => {
    rl.write(suggestedCommit)
  }, 50)
}
