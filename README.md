# 旅行搭子匹配测试 - H5版本

## ✅ 已完成的功能

- 首页：输入昵称开始测试
- 答题页：10道旅行习惯测试题
- 结果页：旅行风格分析 + 匹配度计算
- 邀请功能：生成邀请链接分享给旅伴
- 匹配分析：两人都答完后显示匹配度和详细分析

## 📁 文件结构

```
travel-companion-h5/
├── index.html      # 首页
├── quiz.html       # 答题页
├── result.html     # 结果页
├── styles.css      # 样式文件
├── app.js          # 核心逻辑
├── questions.js    # 题库和匹配算法
└── README.md       # 说明文档
```

## 🚀 部署方式（按推荐度排序）

### 方式1：Vercel（最推荐，免费，一键部署

1. 注册 GitHub 账号
2. 把这些文件上传到一个新的 GitHub 仓库
3. 访问 https://vercel.com，用 GitHub 账号登录
4. 点击 "Import Project"，选择你的仓库
5. 点击 "Deploy"，等待 30秒即可完成！

### 方式2：Netlify（同样简单，拖放上传）

1. 访问 https://www.netlify.com
2. 注册登录
3. 直接把整个 `travel-companion-h5` 文件夹拖到上传区域
4. 上传完成即部署成功！

### 方式3：Cloudflare Pages（国内访问快）

1. 访问 https://pages.cloudflare.com
2. 注册 Cloudflare 账号
3. 连接 GitHub 仓库
4. 选择项目部署

### 方式4：GitHub Pages（完全免费）

1. 创建 GitHub 仓库
2. 上传所有文件
3. 在仓库设置 -> Settings -> Pages
4. 选择 main 分支，点击 Save
5. 几分钟后就可以通过 `yourname.github.io/travel-companion` 访问

### 方式5：Gitee Pages（国内访问快）

1. 类似 GitHub，国内访问更快

## 📱 使用流程

### 邀请者：
1. 打开网站 → 输入昵称 → 开始测试
2. 完成10道题 → 查看自己的旅行风格
3. 点击"生成邀请链接" → 复制链接发给旅伴

### 被邀请者：
1. 打开邀请链接 → 自动进入测试
2. 完成10道题 → 查看两人的匹配度和详细分析

## 💡 技术说明

- 纯前端实现，无需后端服务器
- 使用 localStorage 存储测试数据
- 完全响应式，支持手机和桌面
- 纯静态文件，任何静态托管都支持

## ⚠️ 注意事项

1. 数据存在浏览器本地，清除浏览器数据会丢失
2. 如果需要持久化存储，可以考虑接入后端或云端数据库
3. 目前是单设备测试，同一链接只能测试两个人
```

## 🎨 预览截图

首页：输入昵称开始
答题页：10道题，进度条
结果页：匹配度+分析
```

## 🔧 自定义修改

- 修改题目：编辑 `questions.js` 中的 questions 数组
- 修改样式：编辑 `styles.css`
- 修改逻辑：编辑 `app.js`
```

