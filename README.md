# Tencent Ads Conversion SDK

[![npm](https://img.shields.io/npm/v/tencent-ads-conversion)](https://www.npmjs.com/package/tencent-ads-conversion)
[![GitHub license](https://img.shields.io/github/license/howell5/tencent-ads-conversion)](https://github.com/howell5/tencent-ads-conversion/blob/main/LICENSE)

非官方腾讯广告转化追踪 SDK，支持 callback 和 clickId 两种上报方式。

## 特性

- 🚀 自动处理 URL 参数
- 💪 TypeScript 支持
- 🔄 支持 callback 和 clickId 两种上报方式
- 📦 零依赖
- 🛡️ 完整的测试覆盖

## 安装

```bash
# npm
npm install tencent-ads-conversion

# yarn
yarn add tencent-ads-conversion

# pnpm
pnpm add tencent-ads-conversion
```

## 使用方法

### 基础使用

```typescript
import TencentAdsConversion from 'tencent-ads-conversion'

const conversion = new TencentAdsConversion({
  accessToken: 'YOUR_ACCESS_TOKEN',
})

// 上报转化
await conversion.reportConversion({
  actionType: 'PURCHASE',
  value: 10000, // 金额，单位分
  quantity: 1,
})
```

### Callback 方式

```typescript
// URL: https://example.com?__CALLBACK__=encoded_callback_data

const conversion = new TencentAdsConversion({
  accessToken: 'YOUR_ACCESS_TOKEN',
})

await conversion.reportConversion({
  actionType: 'PURCHASE',
  value: 10000,
})
```

### ClickId 方式

```typescript
// URL: https://example.com?gdt_vid=click_id_value

const conversion = new TencentAdsConversion({
  accessToken: 'YOUR_ACCESS_TOKEN',
  accountId: 'YOUR_ACCOUNT_ID',
  actionSetId: 'YOUR_ACTION_SET_ID',
})

await conversion.reportConversion({
  actionType: 'PURCHASE',
  value: 10000,
})
```

### Nuxt3 集成

```typescript
// plugins/tencent-ads.client.ts
import TencentAdsConversion from 'tencent-ads-conversion'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const conversion = new TencentAdsConversion({
    accessToken: config.public.tencentAdsToken,
  })

  return {
    provide: {
      tencentAds: conversion,
    },
  }
})

// 在组件中使用
const { $tencentAds } = useNuxtApp()

await $tencentAds.reportConversion({
  actionType: 'PURCHASE',
  value: 10000,
})
```

## API 文档

### 初始化选项

| 参数        | 类型   | 必填 | 说明                               |
| ----------- | ------ | ---- | ---------------------------------- |
| accessToken | string | 是   | 腾讯广告接口访问令牌               |
| accountId   | string | 否   | 广告主账号 ID(仅 clickId 方式需要) |
| actionSetId | string | 否   | 行为数据源 ID(仅 clickId 方式需要) |

### 方法

#### reportConversion(params)

上报转化行为

参数：

| 字段         | 类型   | 必填 | 说明               |
| ------------ | ------ | ---- | ------------------ |
| actionType   | string | 是   | 转化类型           |
| value        | number | 否   | 转化价值(单位：分) |
| quantity     | number | 否   | 数量               |
| outerId      | string | 否   | 外部订单 ID        |
| customParams | object | 否   | 自定义参数         |

返回值：

```typescript
interface ConversionResponse {
  code: number
  message: string
  data?: any
}
```

#### getTrackingStatus()

获取当前追踪状态

返回值：

```typescript
interface TrackingStatus {
  hasCallback: boolean
  hasClickId: boolean
  trackingMethod: 'callback' | 'clickId' | 'none'
  callback?: string
  clickId?: string
}
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 运行测试
pnpm test
```

## License

[MIT](./LICENSE)
