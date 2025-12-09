// frontend/src/components/LivroForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import './LivroForm.css';

/**
 * Props:
 * - livro: objeto para edição (opcional)
 * - onSubmit(payload) -> payload pode ser FormData (quando contém arquivo) ou plain object
 * - onCancel()
 */
const LivroForm = ({ livro, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    categoria: '',
    ano: '',
    editora: '',
    numeroPaginas: '',
    coverUrl: '' // apenas para controlar input visual
  });
  const [localError, setLocalError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    if (livro) {
      setFormData({
        titulo: livro.titulo ?? '',
        autor: livro.autor ?? '',
        categoria: livro.categoria ?? '',
        ano: livro.ano ?? '',
        editora: livro.editora ?? '',
        numeroPaginas: livro.numeroPaginas ?? '',
        coverUrl: livro.cover_image ?? '' // PADRONIZADO
      });
    } else {
      setFormData({
        titulo: '',
        autor: '',
        categoria: '',
        ano: '',
        editora: '',
        numeroPaginas: '',
        coverUrl: ''
      });
    }
    setLocalError('');
    if (fileRef.current) fileRef.current.value = '';
  }, [livro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    // validação mínima cliente - mantém igual
    const missing = [];
    const requiredFields = ['titulo', 'autor', 'categoria', 'ano', 'numeroPaginas'];

    for (const f of requiredFields) {
      const value = formData[f];
      if (value === undefined || value === null || value === '') {
        missing.push(f);
      }
    }

    if (missing.length) {
      setLocalError('Preencha todos os campos obrigatórios: ' + missing.join(', '));
      return;
    }

    const anoNum = parseInt(formData.ano, 10);
    const paginasNum = parseInt(formData.numeroPaginas, 10);

    if (!Number.isInteger(anoNum) || !Number.isInteger(paginasNum) || paginasNum <= 0) {
      setLocalError('Ano e número de páginas devem ser inteiros válidos (páginas > 0).');
      return;
    }

    const file = fileRef.current?.files?.[0];

    if (file) {
      const fd = new FormData();

      // Converte TODOS os valores para string ao adicionar ao FormData
      fd.append('titulo', String(formData.titulo));
      fd.append('autor', String(formData.autor));
      fd.append('categoria', String(formData.categoria));
      fd.append('ano', String(anoNum)); // Converte para string
      fd.append('numeroPaginas', String(paginasNum)); // Converte para string

      if (formData.editora) fd.append('editora', String(formData.editora));

      fd.append('cover', file); // nome correto do campo para multer

      if (formData.coverUrl) {
        fd.append('coverUrl', String(formData.coverUrl));
      }

      onSubmit(fd);
      return;
    }

    // envio JSON comum - mantém igual
    const payload = {
      titulo: formData.titulo,
      autor: formData.autor,
      categoria: formData.categoria,
      ano: anoNum,
      numeroPaginas: paginasNum,
      editora: formData.editora || null,
      coverUrl: formData.coverUrl || null
    };

    onSubmit(payload);
  };

  return (
    <div className="livro-form-overlay">
      <div className="livro-form-container">
        <h2>{livro ? 'Editar Livro' : 'Novo Livro'}</h2>

        {localError && <div className="alert alert-error">{localError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="titulo">Título *</label>
            <input id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label htmlFor="autor">Autor *</label>
            <input id="autor" name="autor" value={formData.autor} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label htmlFor="categoria">Categoria *</label>
            <input id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label htmlFor="ano">Ano *</label>
            <input id="ano" name="ano" value={formData.ano} onChange={handleChange} type="number" />
          </div>

          <div className="input-group">
            <label htmlFor="numeroPaginas">Número de páginas *</label>
            <input id="numeroPaginas" name="numeroPaginas" value={formData.numeroPaginas} onChange={handleChange} type="number" min="1" />
          </div>

          <div className="input-group">
            <label htmlFor="editora">Editora</label>
            <input id="editora" name="editora" value={formData.editora} onChange={handleChange} />
          </div>

          <hr />

          <div className="input-group">
            <label htmlFor="coverUrl">URL da capa (opcional)</label>
            <input
              id="coverUrl"
              name="coverUrl"
              value={formData.coverUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
            <small className="hint">
              Informe uma URL pública da imagem ou selecione um arquivo abaixo. Se enviar um arquivo, ele terá preferência.
            </small>
          </div>

          <div className="input-group">
            <label htmlFor="cover">Arquivo de capa (opcional)</label>
            <input id="cover" name="cover" type="file" accept="image/*" ref={fileRef} />
            <small className="hint">Imagens até 5MB. Enviar arquivo sobrescreve coverUrl.</small>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-success">{livro ? 'Atualizar' : 'Criar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LivroForm;
