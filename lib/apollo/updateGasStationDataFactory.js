export const updateGasStationDataFactory = (gasStationDataVar) => {
  return (newData) => {
    gasStationDataVar(newData)
  }
}
