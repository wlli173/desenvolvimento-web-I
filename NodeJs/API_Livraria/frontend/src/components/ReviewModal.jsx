// frontend/src/components/ReviewModal.jsx
import React, { useState } from 'react';
import { reviewsService } from '../services/reviewsService';
import './ReviewModal.css';

const ReviewModal = ({ livro, onClose, onSaved }) => {
  const [conteudo, setConteudo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!conteudo || !conteudo.trim()) {
      setError('Digite a review');
      return;
    }
    try {
      setLoading(true);
      await reviewsService.create({ livro_id: livro.id, conteudo: conteudo.trim() });
      setConteudo('');
      onSaved && onSaved();
      onClose && onClose();
    } catch (err) {
      setError(err.message || 'Erro ao enviar review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>Escrever review — {livro.titulo}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </header>

        <form onSubmit={handleSubmit}>
          <textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)} rows="6" placeholder="Compartilhe sua opinião..." />
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
