const PODS = Object.freeze([
  '0x2f994e2e4f3395649eee8a89092e63ca526da829',
  '0x386eb78f2ee79adde8bdb0a0e27292755ebfea58'
])

export const useIsAddressAPod = (address) => {
  return PODS.includes(address?.toLowerCase())
}
