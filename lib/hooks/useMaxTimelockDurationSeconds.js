// TODO: This is a workaround since 3.4.3 remnove max timelock duration from the schema
// if contract < 3.4.3 read `maxTimelockDuration`
// else call `estimateCreditAccrualTime` - I think?
export const useMaxTimelockDurationSeconds = (poolAddress) => {
  console.error('INCOMPLETE')
  return '0'
}
