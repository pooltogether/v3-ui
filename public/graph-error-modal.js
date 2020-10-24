if (typeof window !== 'undefined') {
  window.showGraphError = function () {
    setTimeout(
      () => { document.getElementById('graph-error-modal').classList.remove('hidden') }
    , 2000)
  }

  window.hideGraphError = function () {
    document.getElementById('graph-error-modal').classList.add('hidden')
  }
}