function errorHandler(error, req, res, next) {
  const errorMessage = error.message || undefined

  switch(errorMessage) {
    case('Data Not Found'): 
      res.status(404).json({
        status: '404', 
        error: 'Not Found'
      })
      break
    
    case('Not Authorized'): 
      res.status(401).json({
        status: '401',
        error: 'Not Authorized'
      })
      break
    
    case('Server Error') : 
      res.status(500).json({
          status: '500', 
          error: 'Server Error'
      })
    
    default : 
      res.status(500).json({
          status: '500', 
          error: 'Server Error'
      })
  }
}

module.exports = errorHandler