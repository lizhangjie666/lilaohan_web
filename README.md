# 李老汉窑烤面包品牌官网

前后端分离项目：`frontend` 为 Nuxt 3 动态官网，`backend` 为全中文 Strapi 5 内容后台。

## 本地开发

1. 为 PostgreSQL 创建数据库 `lilaohan`。
2. 分别复制 `frontend/.env.example` 与 `backend/.env.example` 为 `.env`，填写真实配置。
3. 在 `backend` 运行 `npm run develop`，首次访问 `http://localhost:1337/admin` 创建管理员。
4. 后台会自动创建“内容编辑”角色，并为公开访问角色配置只读内容权限。
5. 在 `frontend` 运行 `npm run dev`，访问 `http://localhost:3000`。

开发环境带有一套明确标注的兜底内容，便于 Strapi 未启动时预览。生产环境不会在菜单为空时回填演示产品。正式上线前应在后台补齐真实门牌、营业时间、电话、微信、地图链接、产品价格、镇山村点位与实拍图片。

## 中文后台的日常操作

- 访问 `http://localhost:1337/admin`，登录后界面默认显示简体中文。
- 在“产品分类”和“菜单产品”中维护窑烤菜单；内容需要点击“发布”后才会显示在官网。
- 在“官网与照片设置”中替换首页、菜单、DIY和打卡指南主图，也可上传微信二维码。
- 在“手作体验”中维护步骤图片和演示视频链接。视频链接必须以 `https://` 开头。
- 店员账号应分配“内容编辑”角色，不要分配超级管理员角色。

## 动态部署

- 复制 `deploy/.env.example` 为 `deploy/.env`，填写域名、数据库密码和随机密钥。
- 运行 `docker compose --env-file deploy/.env up -d --build`，启动 Nuxt、Strapi、PostgreSQL 和 Caddy。
- Caddy 将 `/admin`、`/api` 和 `/uploads` 转发到 Strapi，其余页面转发到 Nuxt；后台发布后官网会在下一次访问时读取新内容。
- 上传文件默认保存在 Docker 数据卷中；正式长期运行建议接入阿里云 OSS 或腾讯云 COS，并做好数据库与上传目录备份。
- 中国大陆公开网站上线前完成域名实名认证、ICP备案及必要的公安备案。

现有 ChatGPT Sites 地址继续作为静态临时版本，不使用当前动态构建覆盖。正式服务器验收完成后再切换域名。
