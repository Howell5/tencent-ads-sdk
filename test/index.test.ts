import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import TencentAdsConversion from '../src'
import type { ConversionParams } from '../src/types'

describe('TencentAdsConversion', () => {
  let mockFetch: any

  beforeEach(() => {
    // Mock fetch API
    mockFetch = vi.fn()
    global.fetch = mockFetch

    // Mock successful response
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ code: 0, message: 'success' }),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with access token', () => {
      const conversion = new TencentAdsConversion({
        accessToken: 'test-token',
      })
      expect(conversion).toBeInstanceOf(TencentAdsConversion)
    })

    it('should handle URL parameters in browser environment', () => {
      // Mock window.location
      const originalWindow = { ...window }
      const mockLocation = new URL('https://example.com?gdt_vid=test-click-id')
      vi.stubGlobal('window', {
        location: mockLocation,
      })

      const conversion = new TencentAdsConversion({
        accessToken: 'test-token',
        accountId: 'test-account',
        actionSetId: 'test-action-set',
      })

      const status = conversion.getTrackingStatus()
      expect(status.clickId).toBe('test-click-id')

      // Restore window
      vi.stubGlobal('window', originalWindow)
    })
  })

  describe('reportConversion', () => {
    it('should send conversion with callback method', async () => {
      // Mock window.location with callback parameter
      const originalWindow = { ...window }
      const mockLocation = new URL('https://example.com?__CALLBACK__=' + encodeURIComponent(encodeURIComponent('test-callback')))
      vi.stubGlobal('window', {
        location: mockLocation,
      })

      const conversion = new TencentAdsConversion({
        accessToken: 'test-token',
      })

      const params: ConversionParams = {
        actionType: 'PURCHASE',
        value: 10000,
        quantity: 1,
      }

      await conversion.reportConversion(params)

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Access-Token': 'test-token',
          }),
          body: expect.stringContaining('test-callback'),
        })
      )

      // Restore window
      vi.stubGlobal('window', originalWindow)
    })

    it('should send conversion with clickId method', async () => {
      // Mock window.location with clickId parameter
      const originalWindow = { ...window }
      const mockLocation = new URL('https://example.com?gdt_vid=test-click-id')
      vi.stubGlobal('window', {
        location: mockLocation,
      })

      const conversion = new TencentAdsConversion({
        accessToken: 'test-token',
        accountId: 'test-account',
        actionSetId: 'test-action-set',
      })

      const params: ConversionParams = {
        actionType: 'PURCHASE',
        value: 10000,
        quantity: 1,
      }

      await conversion.reportConversion(params)

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Access-Token': 'test-token',
          }),
          body: expect.stringContaining('test-click-id'),
        })
      )

      // Restore window
      vi.stubGlobal('window', originalWindow)
    })

    it('should handle API errors', async () => {
      // Mock API error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      })

      const conversion = new TencentAdsConversion({
        accessToken: 'test-token',
      })

      const params: ConversionParams = {
        actionType: 'PURCHASE',
        value: 10000,
      }

      await expect(conversion.reportConversion(params)).rejects.toThrow()
    })

    it('should validate required parameters', async () => {
      const conversion = new TencentAdsConversion({
        accessToken: 'test-token',
      })

      // No tracking method available
      const params: ConversionParams = {
        actionType: 'PURCHASE',
        value: 10000,
      }

      await expect(conversion.reportConversion(params)).rejects.toThrow()
    })
  })

  describe('getTrackingStatus', () => {
    it('should return correct tracking status for callback method', () => {
      const originalWindow = { ...window }
      const mockLocation = new URL('https://example.com?__CALLBACK__=' + encodeURIComponent(encodeURIComponent('test-callback')))
      vi.stubGlobal('window', {
        location: mockLocation,
      })

      const conversion = new TencentAdsConversion({
        accessToken: 'test-token',
      })

      const status = conversion.getTrackingStatus()
      expect(status.hasCallback).toBe(true)
      expect(status.hasClickId).toBe(false)
      expect(status.trackingMethod).toBe('callback')

      vi.stubGlobal('window', originalWindow)
    })

    it('should return correct tracking status for clickId method', () => {
      const originalWindow = { ...window }
      const mockLocation = new URL('https://example.com?gdt_vid=test-click-id')
      vi.stubGlobal('window', {
        location: mockLocation,
      })

      const conversion = new TencentAdsConversion({
        accessToken: 'test-token',
        accountId: 'test-account',
        actionSetId: 'test-action-set',
      })

      const status = conversion.getTrackingStatus()
      expect(status.hasCallback).toBe(false)
      expect(status.hasClickId).toBe(true)
      expect(status.trackingMethod).toBe('clickId')

      vi.stubGlobal('window', originalWindow)
    })
  })
})
