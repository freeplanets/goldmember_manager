 # 林口高爾夫球場雲端管理系統 API 
 ## 林口高爾夫球場雲端管理系統的後端 API 規格文件。

## 主要功能
- 使用者認證與授權
- 會員資料管理
- 公告系統
- 優惠券管理
- 報表與分析
 
<br/>

### 安裝初始軟體包並套用 Prettier(Installing initial packages and applying Pretier)

```sh
npm install && npm run format
```

<br/>

### Swagger Doc

- http://localhost:3000/api-docs/

<br/>

### local build & running

```sh
npm run start:local
```

### deploy

```sh
npm run build & npm run start
```

### unit test

```sh
npm run test
```

<br/>

## src skeleton

```sh
src
├── /config
│   └── .env.local
├── /controller
│   └── ...
├── /dto
│   └── ...
├── /module
│   └── ...
├── /service
│   └── ...
├── /utils
│   └── all-exception.filter.ts
│   └── common-exception.filter.ts
│   └── common-exception.ts
│   └── constant.ts
│   └── swagger.ts
├── app.module.ts
├── main.ts
```

- src/config : 設定專案環境變數(Set Project Environment Variables)
- src/controller : 客戶端請求/回應處理(Client Request/Response Processing)
- src/dto : 客戶端請求/回應 DTO(Tata Transfer Object) (Client Request/Response DTO(Tata Transfer Object))
- src/module : 服務模組 (Service Module)
- src/service: 業務邏輯 (Business Logic)
- src/utils : 常用函數 (Common Features)
- src/app.module.ts : Root 模組 (Root Module)
- src/main.ts : 專案執行 (Running a project)

## git commit style

- type
  - feat : 新增功能(add new features)
  - fix : 錯誤修復(bug fix)
  - docs : 문서의 수정(doc fix)
  - refactor : 編輯文檔 (refectoring code)
  - test : 測試相關程式碼新增及修改(add or modify test-related code)
  - chore : 無需修改程式碼即可更改設定 (change settings without code modification)

```s
如何新增 - feat: 增加了登入功能 (How to create - feat: add login function )
```
