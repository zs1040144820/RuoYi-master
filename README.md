# IPv6安全感知及主动防护系统前后端分离-后端
&nbsp;&nbsp;本系统采用B/S架构，分为前端、后端和数据库三部分。其中，用户通过前端登录自己账号密码，认证后可使用自己所属角色使用允许的相关功能，包括系统管理、地址生成、漏洞扫描三大部分。通过系统管理模块，可以添加用户、设置角色、管理日志等；通过地址生成模块，可以进行资产发现、资产扫描、地址预测等；通过漏洞扫描可以设定参数，对资产或资产列表进行漏洞扫描，并查看历史扫描记录等。前端通过发送请求到后端，由后端解析命令并且执行相应代码，从而提供相应的服务。后端的核心功能是调用扫描器，扫描资产和发现漏洞，并且更新漏洞库。更进一步，通过地址预测在前端给定参数情形下进行地址生成。数据库中存储扫描过程中需要存储的相关信息。蜜罐诱捕系统，是基于云原生技术（k3s）的欺骗防御系统，可以真实仿真业务环境，系统通过部署高交互高仿真蜜罐及流量代理转发，将攻击者的攻击引导到蜜罐中，达到扰乱引导以及延迟攻击的效果，可以很大程度上保护业务的安全。


## 主要技术
### IPv6资产发现与漏洞扫描系统
![在这里插入图片描述](https://img-blog.csdnimg.cn/3dc176104b2e481c8f2c83bf767818d7.png)
### 明阳蜜罐系统
![在这里插入图片描述](https://img-blog.csdnimg.cn/047dda8b9a5c433e89ab2666122c4827.png)

## 项目构架图
### IPv6资产发现与漏洞扫描系统架构图
![在这里插入图片描述](https://img-blog.csdnimg.cn/7dcf481d3f8c4c3e89d6edf0dc16f214.png)
### 明阳蜜罐系统架构图
![在这里插入图片描述](https://img-blog.csdnimg.cn/d5b98466dd7b4ea3890934c0b2e08e6a.png)

## 功能列表
### IPv6资产发现与漏洞扫描系统架构图
![在这里插入图片描述](https://img-blog.csdnimg.cn/0676f08a9e464944a5a17813e9f00410.png)


![在这里插入图片描述](https://img-blog.csdnimg.cn/1812e01b2c274e07b9e95174e35e11fb.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/7b3375a84bd9478e93c2a92b4187d461.png)
### 明阳蜜罐系统架构图
![在这里插入图片描述](https://img-blog.csdnimg.cn/908b47eee8604b1db435f69ff15242c1.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/0b3133e8463742ceafe7ecd7188e817f.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/572921125edf4063bb170a2166297c53.png)




##   基于多层级分类和空间建模的 IPv6活跃地址发现算法
![在这里插入图片描述](https://img-blog.csdnimg.cn/e83c1dd129f84bd3bd853fe7d9165ed5.png)
### 多层级分类算法
![在这里插入图片描述](https://img-blog.csdnimg.cn/8f4d59e898754fc18b35442f180d1dfa.png)
### 空间建模算法与启发式遍历
![在这里插入图片描述](https://img-blog.csdnimg.cn/4d70d490f3cc4bc0a7429a1d704f6c7c.png)
## 部署环境
### 开发

```bash
# 克隆项目
git clone https://gitee.com/y_project/RuoYi-Vue

# 进入项目目录
cd ruoyi-ui

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev
```

浏览器访问 http://localhost:80

## #发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```