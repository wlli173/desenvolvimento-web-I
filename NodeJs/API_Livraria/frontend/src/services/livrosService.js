// frontend/src/services/livrosService.js
import api from './api';

const getConfigForPayload = (payload) => {
  if (payload instanceof FormData) {
    // Para FormData, deixe o navegador definir os headers
    return {};
  } else {
    // Para objeto JSON, defina Content-Type
    return {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
};

export const livrosService = {
  /**
   * listar - aceita paginação opcional
   * @param {Object} opts { page: number, limit: number }
   * @returns {Promise<Object>} { page, limit, total, totalPages, data: [...] }
   */
  async listar(opts = {}) {
    const { page = 1, limit = 10 } = opts;
    const response = await api.get('/livros', {
      params: { page, limit }
    });
    return response.data;
  },

  async buscarPorId(id) {
    const response = await api.get(`/livros/${id}`);
    return response.data;
  },

  async criar(livro) {
    console.log('=== SERVIÇO criar ===');
    console.log('Tipo:', livro instanceof FormData ? 'FormData' : 'JSON');

    const config = {};

    if (livro instanceof FormData) {
      // CRÍTICO: Para FormData, NÃO defina Content-Type
      // O navegador vai definir automaticamente como multipart/form-data
      // com o boundary correto
      config.headers = {}; // Headers vazios
    } else {
      config.headers = {
        'Content-Type': 'application/json'
      };
    }

    console.log('Config headers:', config.headers);
    const response = await api.post('/livros', livro, config);
    return response.data;
  },

  async atualizar(id, livro) {
    console.log('=== SERVIÇO atualizar ===');
    console.log('Tipo:', livro instanceof FormData ? 'FormData' : 'JSON');

    const config = {};

    if (livro instanceof FormData) {
      // CRÍTICO: Para FormData, NÃO defina Content-Type
      config.headers = {}; // Headers vazios
    } else {
      config.headers = {
        'Content-Type': 'application/json'
      };
    }

    console.log('Config headers:', config.headers);
    const response = await api.put(`/livros/${id}`, livro, config);
    return response.data;
  },

  async atualizar(id, livro) {
    const config = getConfigForPayload(livro);
    const response = await api.put(`/livros/${id}`, livro, config);
    return response.data;
  },

  async remover(id) {
    const response = await api.delete(`/livros/${id}`);
    return response.data;
  }
};

export default livrosService;