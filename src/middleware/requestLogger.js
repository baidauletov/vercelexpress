const requestLogger = (req, res, next) => {
    const requestInfo = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      headers: req.headers,
      query: req.query,
      body: req.body,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };
  
    console.log('Incoming Request:', JSON.stringify(requestInfo, null, 2));
    next();
  };
  
module.exports = { requestLogger };