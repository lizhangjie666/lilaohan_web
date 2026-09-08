# 李老汉窑烤面包品牌官网

前后端分离项目：`frontend` 为 Nuxt 3 品牌官网，`backend` 为 Strapi 5 内容后台。

## 本地开发

1. 为 PostgreSQL 创建数据库 `lilaohan`。
2. 分别复制 `frontend/.env.example` 与 `backend/.env.example` 为 `.env`，填写真实配置。
3. 在 `backend` 运行 `npm run develop`，首次访问 `http://localhost:1337/admin` 创建管理员。
4. 在 Strapi 的 Roles / Public 中只开放各内容类型的 `find` 与 `findOne`，不要开放写权限。
5. 在 `frontend` 运行 `npm run dev`，访问 `http://localhost:3000`。

当前前端带有一套明确标注的开发期兜底内容：当 Strapi 未启动或未发布内容时仍可预览。正式上线前应在后台补齐真实门牌、营业时间、电话、微信、地图链接、产品价格、镇山村点位与实拍图片。

## 发布

- 前端执行 `npm run generate` 后可部署静态产物 `.output/public`。
- 后台部署至支持 Node.js 与 PostgreSQL 的服务，媒体存储建议接入阿里云 OSS 或腾讯云 COS。
- 设置 `FRONTEND_ORIGIN`、数据库密钥和前端 `NUXT_PUBLIC_STRAPI_URL`，所有站点启用 HTTPS。
- 中国大陆公开网站上线前完成域名实名认证、ICP备案及必要的公安备案。
