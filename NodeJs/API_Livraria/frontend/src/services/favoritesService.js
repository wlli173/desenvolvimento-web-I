// frontend/src/services/favoritesService.js
import api from './api';

const handleErr = (err) => {
  const message = err?.response?.data?.erro || err?.message || 'Erro no servidor';
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const favoritesService = {
  // adiciona favorito (POST /api/favorites/:livroId)
  async add(livroId) {
    try {
      const res = await api.post(`/favorites/${livroId}`);
      return res.data;
    } catch (err) {
      handleErr(err);
    }
  },

  // remove favorito (DELETE /api/favorites/:livroId)
  async remove(livroId) {
    try {
      const res = await api.delete(`/favorites/${livroId}`);
      return res.data;
    } catch (err) {
      handleErr(err);
    }
  },

  // lista favoritos do usuário (GET /api/favorites?page=&limit=)
  async list({ page = 1, limit = 200 } = {}) {
    try {
      const res = await api.get('/favorites', { params: { page, limit } });
      // retorna { page, limit, data: [...] } conforme backend
      return res.data;
    } catch (err) {
      handleErr(err);
    }
  },

  // verifica se o livro está favoritado pelo usuário (faz GET /api/favorites e filtra)
  // (Fallback: backend não tem endpoint exists; assim é à prova)
  async exists(livroId) {
    try {
      const res = await api.get('/favorites', { params: { page: 1, limit: 1000 } });
      const data = res.data?.data || [];
      // as entries podem já ser os próprios livros ou objetos com livro_id — normalizamos
      return data.some(item => {
        return Number(item.livro_id || item.id || item.id_livro || item.livro?.id) === Number(livroId);
      });
    } catch (err) {
      // em caso de erro, devolve false (front continuará funcionando)
      return false;
    }
  },

  // conta favoritos de um livro (se o backend tiver endpoint, usar; aqui usamos GET /api/favorites?filter)
  async countByLivro(livroId) {
    try {
      // backend tem repo.countByLivro mas não expusemos endpoint; implementamos por busca direta de favoritos do livro:
      // tente um endpoint hipotético /api/favorites/count/:livroId — se existir ajuste aqui para chamá-lo.
      // fallback: buscar todas as favoritos (limit grande) e contar
      const res = await api.get('/favorites', { params: { page: 1, limit: 2000 } });
      const data = res.data?.data || [];
      return data.reduce((acc, item) => {
        const id = Number(item.livro_id || item.id || item.livro?.id || item.livro_id);
        return acc + (id === Number(livroId) ? 1 : 0);
      }, 0);
    } catch (err) {
      return 0;
    }
  }
};

export default favoritesService;
