// frontend/src/components/FavoriteButton.jsx
import React, { useState, useEffect } from 'react';
import { favoritesService } from '../services/favoritesService';
import './FavoriteButton.css'; // crie com estilos simples ou adicione ao LivroCard.css

const FavoriteButton = ({ livroId, small = false, onToggled }) => {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const exists = await favoritesService.exists(livroId);
        if (!mounted) return;
        setFavorited(Boolean(exists));
        const c = await favoritesService.countByLivro(livroId);
        if (!mounted) return;
        setCount(c);
      } catch (err) {
        // silencioso
      }
    };
    init();
    return () => { mounted = false; };
  }, [livroId]);

  const toggle = async (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      if (favorited) {
        await favoritesService.remove(livroId);
        setFavorited(false);
        setCount(prev => (prev !== null ? Math.max(0, prev - 1) : prev));
        onToggled && onToggled(false);
      } else {
        await favoritesService.add(livroId);
        setFavorited(true);
        setCount(prev => (prev !== null ? prev + 1 : prev));
        onToggled && onToggled(true);
      }
    } catch (err) {
      alert(err.message || 'Erro ao atualizar favorito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fav-wrapper ${small ? 'small' : ''}`}>
      <button className={`icon-btn favorite-btn ${favorited ? 'on' : ''}`} onClick={toggle} disabled={loading} title={favorited ? 'Remover favorito' : 'Adicionar aos favoritos'}>
        {favorited ? '★' : '☆'}
      </button>
      {count !== null && <small className="fav-count">{count}</small>}
    </div>
  );
};

export default FavoriteButton;
