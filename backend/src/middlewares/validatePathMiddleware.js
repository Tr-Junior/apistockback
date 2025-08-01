const allowedPaths = [
    '/',
    '/products',
    '/customers',
    '/orders',
    '/entrance',
    '/exits',
    '/budget',
    '/productBuy',
    '/supplier',
    '/companyInfo',
    '/image',
    '/api',
    '/uploads'
  ];
  
  module.exports = (req, res, next) => {
    const path = req.path.split('?')[0]; // Ignora query parameters
  
    if (!allowedPaths.some(allowedPath => path.startsWith(allowedPath))) {
      return res.status(403).json({ message: 'Acesso negado: caminho não permitido' });
    }
  
    next();
  };
  