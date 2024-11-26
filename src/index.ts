import type { TencentAdsConfig, ConversionParams, ConversionResponse } from './types'
import { API_ENDPOINTS } from './constants'

export * from './types'

export class TencentAdsConversion {
  private readonly accessToken?: string
  private readonly accountId?: string
  private readonly actionSetId?: string
  private readonly callback?: string
  private readonly clickId?: string

  constructor(config: TencentAdsConfig) {
    this.accessToken = config.accessToken
    this.accountId = config.accountId
    this.actionSetId = config.actionSetId

    // 初始化时提取 URL 参数
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      this.callback = this.extractCallback(urlParams)
      this.clickId = urlParams.get('gdt_vid') || ''
    }
  }

  /**
   * 提取并解析 callback 参数
   */
  private extractCallback(params: URLSearchParams): string {
    const callbackParam = params.get('__CALLBACK__')
    if (!callbackParam) return ''

    try {
      // 腾讯广告的 callback 参数通常是双重编码的
      return decodeURIComponent(decodeURIComponent(callbackParam))
    } catch {
      return callbackParam
    }
  }

  /**
   * 构建请求参数
   */
  private buildRequestParams(params: ConversionParams) {
    if (this.callback) {
      return {
        url: API_ENDPOINTS.CALLBACK,
        body: {
          ...params,
          callback: this.callback,
        },
      }
    }

    if (this.clickId && this.accountId && this.actionSetId) {
      return {
        url: API_ENDPOINTS.CLICK_ID,
        body: {
          ...params,
          account_id: this.accountId,
          user_action_set_id: this.actionSetId,
          click_id: this.clickId,
        },
      }
    }

    throw new Error('Neither callback nor clickId tracking method is available')
  }

  /**
   * 验证必要参数
   */
  private validateConfig(): void {
    if (!this.accessToken) {
      throw new Error('Access token is required')
    }

    if (!this.callback && !(this.clickId && this.accountId && this.actionSetId)) {
      throw new Error('Either callback or clickId with accountId and actionSetId is required')
    }
  }

  /**
   * 发送请求到腾讯广告 API
   */
  private async sendRequest(url: string, data: any): Promise<ConversionResponse> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': this.accessToken!,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result as ConversionResponse
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to report conversion: ${error.message}`)
      }
      throw error
    }
  }

  /**
   * 上报转化
   * @param params 转化参数
   * @returns Promise<ConversionResponse>
   * @throws Error 当必要参数缺失或请求失败时
   *
   * @example
   * ```typescript
   * const conversion = new TencentAdsConversion({
   *   accessToken: 'your_token'
   * })
   *
   * await conversion.reportConversion({
   *   actionType: 'PURCHASE',
   *   value: 10000,
   *   quantity: 1
   * })
   * ```
   */
  public async reportConversion(params: ConversionParams): Promise<ConversionResponse> {
    this.validateConfig()

    const { url, body } = this.buildRequestParams(params)

    return this.sendRequest(url, body)
  }

  /**
   * 获取当前追踪状态
   * @returns 当前使用的追踪方式和相关参数
   */
  public getTrackingStatus() {
    return {
      hasCallback: Boolean(this.callback),
      hasClickId: Boolean(this.clickId),
      trackingMethod: this.callback ? 'callback' : this.clickId ? 'clickId' : 'none',
      callback: this.callback,
      clickId: this.clickId,
    }
  }
}

export default TencentAdsConversion
