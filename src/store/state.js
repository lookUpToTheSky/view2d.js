export const state = {
  userEquipment: {
    userName: '',
    userEquipmentGroup: []
  },
  collapse: false,
  file: {
    name: '',
    data: []
  },
  data: {
    scale: 1,
    lineName: 'curve',
    fromArrowType: '',
    toArrowType: 'triangleSolid',
    locked: 0,
    bkColor: '',
    bkImage: '',
    grid: true,
    websocket: ''
  },
  resetLink: {
    count: 0
  },
  viewData: {},
  event: {
    name: '',
    data: null
  },
  canvas: null,
  error: {
    text: ''
  }
}
