// frontend/src/services/reviewsService.js
import api from './api';

const handleErr = (err) => {
  const message = err?.response?.data?.erro || err?.message || 'Erro no servidor';
  const e = new Error(message);
  e.status = err?.response?.status;
  e.details = err?.response?.data?.detalhes;
  throw e;
};

export const reviewsService = {
  async create({ livro_id, conteudo }) {
    try {
      const res = await api.post('/reviews', { livro_id, conteudo });
      return res.data;
    } catch (err) {
      handleErr(err);
    }
  },

  async listByLivro(livroId, { page = 1, limit = 200 } = {}) {
    try {
      const res = await api.get('/reviews', { params: { livro_id: livroId, page, limit } });
      return res.data;
    } catch (err) {
      handleErr(err);
    }
  },

  async getAll({ page = 1, limit = 200 } = {}) {
    try {
      const res = await api.get('/reviews/all', { params: { page, limit } });
      return res.data;
    } catch (err) {
      handleErr(err);
    }
  },

  async remove(reviewId) {
    try {
      const res = await api.delete(`/reviews/${reviewId}`);
      return res.data;
    } catch (err) {
      handleErr(err);
    }
  },

  async update(reviewId, payload) {
    try {
      const res = await api.put(`/reviews/${reviewId}`, payload);
      return res.data;
    } catch (err) {
      handleErr(err);
    }
  },

  async get(reviewId) {
    try {
      const res = await api.get(`/reviews/${reviewId}`);
      return res.data;
    } catch (err) {
      handleErr(err);
    }
  }
};

export default reviewsService;
