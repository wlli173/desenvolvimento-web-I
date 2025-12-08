// frontend/src/services/livrosService.js
import api from './api';

/**
 * Extrai um array de livros do response.data em vários formatos possíveis.
 * Retorna [] se não conseguir extrair.
 */
function extractArray(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.livros)) return data.livros;
  if (Array.isArray(data.data)) return data.data;
  // fallback: se for objeto com chaves numéricas, converte para array
  if (typeof data === 'object') {
    const values = Object.values(data).filter(v => Array.isArray(v));
    if (values.length) return values[0];
  }
  return [];
}

/**
 * Normaliza e lança um erro com informações úteis vindas do servidor (se houver).
 */
function handleResponseError(err) {
  // Axios error
  if (err?.response?.data) {
    const server = err.response.data;
    const message = server.erro || server.message || err.message || 'Erro no servidor';
    const details = server.detalhes || server.errors || null;
    const e = new Error(message);
    e.details = details;
    e.status = err.response.status;
    throw e;
  }
  // Outros erros (network, timeout, etc.)
  const e = new Error(err.message || 'Erro desconhecido');
  e.status = err?.response?.status;
  throw e;
}

export const livrosService = {
  // Lista sempre retorna um array (mesmo em formatos inesperados)
  async listar() {
    try {
      const response = await api.get('/livros', { timeout: 10000 });
      const data = response.data;
      const arr = extractArray(data);
      if (!Array.isArray(arr)) {
        console.warn('livrosService.listar(): formato inesperado recebido (após extração):', data);
        return [];
      }
      return arr;
    } catch (err) {
      handleResponseError(err);
    }
  },

  async buscarPorId(id) {
    try {
      const response = await api.get(`/livros/${id}`);
      return response.data;
    } catch (err) {
      handleResponseError(err);
    }
  },

  async criar(livro) {
    try {
      const response = await api.post('/livros', livro);
      return response.data;
    } catch (err) {
      handleResponseError(err);
    }
  },

  async atualizar(id, livro) {
    try {
      const response = await api.put(`/livros/${id}`, livro);
      return response.data;
    } catch (err) {
      handleResponseError(err);
    }
  },

  async remover(id) {
    try {
      const response = await api.delete(`/livros/${id}`);
      return response.data;
    } catch (err) {
      handleResponseError(err);
    }
  }
};

export default livrosService;