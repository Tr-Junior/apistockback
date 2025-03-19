const errorMiddleware = (err, req, res, next) => {
  console.error("Erro capturado pelo middleware:", err.stack);
  
  // Definição do código de status baseado no erro ou padrão 500
  const statusCode = err.statusCode || 500;
  
  // Mensagem de erro personalizada ou padrão
  const message = err.message || "Erro interno do servidor";
  
  // Detalhes adicionais do erro (se houver)
  const details = err.details || null;
  
  // Tipo do erro para melhor categorização
  const errorType = err.name || "Erro Desconhecido";

  // Estrutura de resposta padronizada para erros
  res.status(statusCode).json({
      success: false,
      errorType,
      message,
      details,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
  });
};

module.exports = errorMiddleware;
