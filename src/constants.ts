export const API_ENDPOINTS = {
  CALLBACK: 'https://api.e.qq.com/v3.0/user_actions/add',
  CLICK_ID: 'https://api.e.qq.com/v1.1/user_actions/add'
} as const

export const ACTION_TYPES = {
  PURCHASE: 'PURCHASE',
  COMPLETE_ORDER: 'COMPLETE_ORDER',
  REGISTER: 'REGISTER'
} as const
