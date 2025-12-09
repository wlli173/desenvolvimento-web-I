// frontend/src/components/ReviewForm.jsx
import React, { useState } from 'react';
import { reviewsService } from '../services/reviewsService';

const ReviewForm = ({ livroId, onSaved }) => {
  const [conteudo, setConteudo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!conteudo || String(conteudo).trim() === '') {
      setError('Digite o conteúdo da review');
      return;
    }
    try {
      setLoading(true);
      await reviewsService.create({ livro_id: Number(livroId), conteudo: conteudo.trim() });
      setConteudo('');
      onSaved && onSaved();
    } catch (err) {
      console.error('create review error', err);
      setError(err.message || 'Erro ao salvar review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)} rows="4" placeholder="Escreva sua review..." />
      {error && <div className="alert alert-error">{error}</div>}
      <div style={{ marginTop: 8 }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
