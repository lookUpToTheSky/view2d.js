export const mutations = {
    emit(state, event) {
      state.event = event
    },
    addView (state, data) {
      state.viewData = data
    },
    change (state, data) {
      state.data = data
    },
    dataScale (state, scale) {
      state.data.scale = scale
    },
    changeFileName (state, name) {
      state.file.name = name
    },
    changeBkImage (state, bkImage) {
      state.data.bkImage = bkImage
    },
    changeBkColor (state, bkColor) {
      state.data.bkColor = bkColor
    },
    changeGrid(state, grid) {
      state.data.grid = grid
    },
    changeWebscoket (state, websocket) {
      state.data.websocket = websocket
    },
    resetWebScoket (state) {
      state.resetLink.count++;
    },
    canvasChange(state, canvas) {
      state.canvas = canvas
    },
    addEquipment (state, equipment) {
      state.userEquipment.userEquipmentGroup = equipment
    },
    addEquipmentGroup (state, group) {
      state.userEquipment.userEquipmentGroup = group
    }
  }