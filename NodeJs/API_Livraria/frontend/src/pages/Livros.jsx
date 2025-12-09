// frontend/src/pages/Livros.jsx
import React, { useState, useEffect } from 'react';
import { livrosService } from '../services/livrosService';
import LivroCard from '../components/LivroCard';
import LivroForm from '../components/LivroForm';
import './Livros.css';

const DEFAULT_LIMITS = [6, 10, 20, 50];

const Livros = () => {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLivro, setEditingLivro] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    carregarLivros(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const carregarLivros = async (pageRequested = 1, limitRequested = 10) => {
    try {
      setLoading(true);
      setError('');
      const resp = await livrosService.listar({ page: pageRequested, limit: limitRequested });
      // resp esperado: { page, limit, total, totalPages, data }
      const lista = Array.isArray(resp.data) ? resp.data : [];
      setLivros(lista);
      setPage(resp.page ?? pageRequested);
      setLimit(resp.limit ?? limitRequested);
      setTotal(resp.total ?? lista.length);
      setTotalPages(resp.totalPages ?? 1);
    } catch (err) {
      console.error('carregarLivros - erro ao listar:', err);
      setError('Erro ao carregar livros.');
      setLivros([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingLivro(null);
    setShowForm(true);
    setError('');
  };

  const handleEdit = (livro) => {
    setEditingLivro(livro);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este livro?')) return;
    try {
      await livrosService.remover(id);
      showSuccess('Livro removido com sucesso!');
      // Recarrega página atual: se não houver itens e page > 1, ajusta página
      const isLastItemOnPage = livros.length === 1 && page > 1;
      if (isLastItemOnPage) setPage(p => Math.max(1, p - 1));
      else carregarLivros(page, limit);
    } catch (err) {
      console.error('handleDelete - erro:', err);
      setError('Erro ao remover livro.');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setError('');

      console.log('=== FRONTEND handleSubmit ===');
      console.log('Tipo de dados:', formData instanceof FormData ? 'FormData' : 'Objeto');

      if (formData instanceof FormData) {
        console.log('Conteúdo do FormData:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`,
            value instanceof File ? `Arquivo: ${value.name} (${value.size} bytes)` : value);
        }

        // Teste: Verifica se o arquivo está realmente no FormData
        const file = formData.get('cover');
        console.log('Arquivo no FormData?', file ? `Sim: ${file.name}` : 'Não');
      }

      let payload = formData;

      // VERIFICA SE É FormData (upload de arquivo)
      if (formData instanceof FormData) {
        // Validação apenas para FormData
        const missing = [];
        const requiredFields = ['titulo', 'autor', 'categoria', 'ano', 'numeroPaginas'];

        requiredFields.forEach(field => {
          const value = formData.get(field);
          if (value === undefined || value === null || String(value).trim() === '') {
            missing.push(field);
          }
        });

        if (missing.length) {
          setError('Preencha todos os campos obrigatórios: ' + missing.join(', '));
          return;
        }

      } else {
        // Código original para objeto simples
        const missing = [];
        ['titulo', 'autor', 'categoria', 'ano', 'numeroPaginas'].forEach((f) => {
          if (formData[f] === undefined || formData[f] === null || String(formData[f]).trim() === '') {
            missing.push(f);
          }
        });

        if (missing.length) {
          setError('Preencha todos os campos obrigatórios: ' + missing.join(', '));
          return;
        }

        payload = {
          titulo: String(formData.titulo).trim(),
          autor: String(formData.autor).trim(),
          categoria: String(formData.categoria).trim(),
          ano: Number(formData.ano),
          editora: formData.editora ? String(formData.editora).trim() : null,
          numeroPaginas: Number(formData.numeroPaginas),
          coverUrl: formData.coverUrl || null
        };
      }

      if (editingLivro) {
        await livrosService.atualizar(editingLivro.id, payload);
        showSuccess('Livro atualizado com sucesso!');
      } else {
        await livrosService.criar(payload);
        showSuccess('Livro criado com sucesso!');
      }

      setShowForm(false);
      setEditingLivro(null);
      setPage(1);
      carregarLivros(1, limit);
    } catch (err) {
      const serverMsg = err?.message || err?.response?.data?.erro || 'Erro ao salvar livro.';
      setError(serverMsg);
      console.error('handleSubmit - erro:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLivro(null);
    setError('');
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // paginação controls
  const goToPrev = () => setPage(p => Math.max(1, p - 1));
  const goToNext = () => setPage(p => Math.min(totalPages, p + 1));
  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1); // reset page
  };

  if (loading) {
    return <div className="loading">Carregando livros...</div>;
  }

  return (
    <div className="container">
      <div className="livros-header">
        <h1>Meus Livros</h1>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--muted)', marginRight: 8 }}>Por página</label>
            <select value={limit} onChange={handleLimitChange}>
              {DEFAULT_LIMITS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={handleCreate} className="btn btn-primary">➕ Adicionar Livro</button>
          </div>
        </div>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {livros.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum livro cadastrado ainda.</p>
          <button onClick={handleCreate} className="btn btn-primary">Adicionar seu primeiro livro</button>
        </div>
      ) : (
        <>
          <div className="livros-grid">
            {livros.map((livro) => (
              <LivroCard key={livro.id} livro={livro} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>

          {/* Pagination controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
            <div style={{ color: 'var(--muted)' }}>
              Página {page} de {totalPages} — {total} {total === 1 ? 'livro' : 'livros'}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={() => { setPage(1); }} disabled={page === 1}>⏮︎ Primeiro</button>
              <button className="btn" onClick={goToPrev} disabled={page === 1}>◀️ Anterior</button>
              <button className="btn" onClick={goToNext} disabled={page === totalPages}>Próximo ▶️</button>
              <button className="btn" onClick={() => { setPage(totalPages); }} disabled={page === totalPages}>Último ⏭</button>
            </div>
          </div>
        </>
      )}

      {showForm && <LivroForm livro={editingLivro} onSubmit={handleSubmit} onCancel={handleCancel} />}
    </div>
  );
};

export default Livros;
