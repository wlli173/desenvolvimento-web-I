// frontend/src/pages/Favoritos.jsx
import React, { useState, useEffect } from 'react';
import { favoritesService } from '../services/favoritesService';
import LivroCard from '../components/LivroCard';

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const carregar = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await favoritesService.list({ page: 1, limit: 200 });
      const data = res?.data || res || [];
      setFavoritos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('favoritos carregar', err);
      setError(err.message || 'Erro ao carregar favoritos');
      setFavoritos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleDelete = async (livroId) => {
    if (!window.confirm('Remover dos favoritos?')) return;
    try {
      await favoritesService.remove(livroId);
      carregar();
    } catch (err) {
      alert(err.message || 'Erro ao remover favorito');
    }
  };

  if (loading) return <div>Carregando favoritos...</div>;

  return (
    <div className="container">
      <h1>Meus Favoritos</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {favoritos.length === 0 ? (
        <div>Nenhum favorito ainda.</div>
      ) : (
        <div className="livros-grid">
          {favoritos.map(f => (
            // dependendo do formato que favorites endpoint retorna, `f` pode ser o livro diretamente
            // então passamos f como livro. Se vier com wrapper, ajuste.
            <LivroCard key={f.id || f.livro_id} livro={f} onDelete={handleDelete} onEdit={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoritos;
