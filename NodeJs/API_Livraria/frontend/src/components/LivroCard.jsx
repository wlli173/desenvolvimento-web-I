import React from 'react';
import './LivroCard.css';

const LivroCard = ({ livro, onEdit, onDelete }) => {
  return (
    <div className="livro-card">
      <h3>{livro.titulo}</h3>
      <p><strong>Autor:</strong> {livro.autor}</p>
      <p><strong>Ano:</strong> {livro.ano}</p>
      <p><strong>Categoria:</strong> {livro.categoria}</p>

      {livro.editora && (
        <p><strong>Editora:</strong> {livro.editora}</p>
      )}

      {livro.numeroPaginas !== undefined && livro.numeroPaginas !== null && (
        <p><strong>Páginas:</strong> {livro.numeroPaginas}</p>
      )}

      <div className="card-actions">
        <button onClick={() => onEdit(livro)} className="btn btn-primary">
          ✏️ Editar
        </button>
        <button onClick={() => onDelete(livro.id)} className="btn btn-danger">
          🗑️ Remover
        </button>
      </div>
    </div>
  );
};

export default LivroCard;
