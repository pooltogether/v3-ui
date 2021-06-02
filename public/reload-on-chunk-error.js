// ChunkLoadErrors happen when someone has the app loaded, then we deploy a // new
// release, and the user's app points to previous chunks that no longer exist
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    console.log(e)
    console.log(e.message)
    
    if (/Loading chunk [\d]+ failed/.test(e.message)) {
      window.location.reload()
    }
  })
}
