// frontend/src/components/ReviewList.jsx
import React from 'react';
import { reviewsService } from '../services/reviewsService';

const ReviewItem = ({ item, onDeleted }) => {
  const handleDelete = async () => {
    if (!window.confirm('Remover esta review?')) return;
    try {
      await reviewsService.remove(item.id);
      onDeleted && onDeleted();
    } catch (err) {
      alert(err.message || 'Erro ao remover review');
    }
  };

  return (
    <div className="review-item" style={{ borderBottom: '1px solid #eee', padding: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <strong>{item.username || 'Usuário'}</strong>
        <small style={{ color: '#888' }}>{new Date(item.created_at).toLocaleString()}</small>
      </div>
      <p style={{ marginTop: 6 }}>{item.conteudo}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        {/* Só mostra btn deletar se backend permitir (tentamos e capturamos 403) */}
        <button className="btn btn-danger btn-small" onClick={handleDelete}>Remover</button>
      </div>
    </div>
  );
};

const ReviewList = ({ reviews = [], onDeleted }) => {
  if (!reviews || reviews.length === 0) {
    return <div>Nenhuma review ainda.</div>;
  }
  return (
    <div className="review-list">
      {reviews.map(r => <ReviewItem key={r.id} item={r} onDeleted={onDeleted} />)}
    </div>
  );
};

export default ReviewList;
