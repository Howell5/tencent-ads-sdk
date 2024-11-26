export interface TencentAdsConfig {
  accessToken?: string
  accountId?: string
  actionSetId?: string
}

export interface ConversionParams {
  actionType: string
  value?: number
  quantity?: number
  outerId?: string
  customParams?: Record<string, any>
}

export interface ConversionResponse {
  code: number
  message: string
  data?: any
}
