const errorMiddleware = (err, req, res, next) => {
    console.error("Erro capturado:", err.message);
  
    // Resposta padrão para erros
    const statusCode = err.statusCode || 500; // Padrão 500 para erros do servidor
    const errorMessage = err.message || "Erro interno no servidor.";
  
    return res.status(statusCode).json({
      erro: true,
      mensagem: errorMessage,
    });
  };
  
  module.exports = errorMiddleware;
  