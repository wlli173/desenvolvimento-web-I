import React, { useState } from 'react';
import FavoriteButton from './FavoriteButton';
import ReviewModal from './ReviewModal';
import './LivroCard.css';

const LivroCard = ({ livro, onEdit = () => {}, onDelete = () => {}, onFavorite: onFavoriteProp, onReview: onReviewProp }) => {
  const placeholder = 'https://placehold.co/160x220?text=Sem+Capa';
  const cover = (livro && (livro.cover_image || livro.coverUrl)) || placeholder;

  const [showReviewModal, setShowReviewModal] = useState(false);

  // Handler simples que chama o callback passado por prop (se houver)
  const handleFavoriteToggled = (isFav) => {
    if (typeof onFavoriteProp === 'function') {
      try { onFavoriteProp(livro, isFav); } catch (err) { console.error(err); }
    }
  };

  const handleOpenReview = () => {
    if (typeof onReviewProp === 'function') {
      // se o pai providenciou um handler, o chamamos para, por exemplo, abrir uma página dedicada
      try { onReviewProp(livro); return; } catch (err) { console.error(err); }
    }
    // caso contrário abrimos modal localmente
    setShowReviewModal(true);
  };

  return (
    <>
      <div className="livro-card">
        <div className="livro-cover">
          <img
            src={cover}
            alt={`Capa de ${livro?.titulo ?? 'livro'}`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = placeholder;
            }}
          />
        </div>

        <div className="livro-content">
          <div className="livro-header-row">
            <h3 className="livro-title">{livro.titulo}</h3>

            <div className="header-actions">
              {/* FavoriteButton cuida de estado e contador, recebe small para tamanho reduzido */}
              <FavoriteButton livroId={livro.id} small onToggled={handleFavoriteToggled} />

              {/* Botão para abrir review (chama callback do pai se houver) */}
              <button
                className="icon-btn review-btn"
                onClick={handleOpenReview}
                title="Escrever review"
                aria-label={`Escrever review para ${livro.titulo}`}
              >
                📝
              </button>
            </div>
          </div>

          <p><strong>Autor:</strong> {livro.autor}</p>
          <p><strong>Ano:</strong> {livro.ano}</p>
          <p><strong>Categoria:</strong> {livro.categoria}</p>
          {livro.editora && <p><strong>Editora:</strong> {livro.editora}</p>}
          {livro.numeroPaginas !== undefined && <p><strong>Páginas:</strong> {livro.numeroPaginas}</p>}

          <div className="card-actions">
            <button onClick={() => onEdit(livro)} className="btn btn-primary">✏️ Editar</button>
            <button onClick={() => onDelete(livro.id)} className="btn btn-danger">🗑️ Remover</button>
          </div>
        </div>
      </div>

      {showReviewModal && (
        <ReviewModal
          livro={livro}
          onClose={() => setShowReviewModal(false)}
          onSaved={() => {
            // opcional: aqui você pode disparar algo, ex: notificar o usuário ou recarregar reviews
            setShowReviewModal(false);
          }}
        />
      )}
    </>
  );
};

export default LivroCard;
