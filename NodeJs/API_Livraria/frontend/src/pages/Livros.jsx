import React, { useState, useEffect } from 'react';
import { livrosService } from '../services/livrosService';
import LivroCard from '../components/LivroCard';
import LivroForm from '../components/LivroForm';
import './Livros.css';

const Livros = () => {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false); // por padrão fechado
  const [editingLivro, setEditingLivro] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    carregarLivros();
  }, []);

  const carregarLivros = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await livrosService.listar();
      setLivros(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erro ao carregar livros.');
      console.error('carregarLivros - erro:', err);
      setLivros([]);
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
      carregarLivros();
    } catch (err) {
      setError('Erro ao remover livro.');
      console.error('handleDelete - erro:', err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setError('');

      // Validação mínima no cliente (garante que o backend não receba payloads faltando)
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

      // Coerção de tipos
      const anoNum = Number(formData.ano);
      const paginasNum = Number(formData.numeroPaginas);

      if (!Number.isInteger(anoNum) || !Number.isInteger(paginasNum) || paginasNum <= 0) {
        setError('Ano e número de páginas devem ser inteiros válidos (páginas > 0).');
        return;
      }

      // Monta payload conforme model esperado pelo backend
      const payload = {
        titulo: String(formData.titulo).trim(),
        autor: String(formData.autor).trim(),
        categoria: String(formData.categoria).trim(),
        ano: anoNum,
        editora: formData.editora ? String(formData.editora).trim() : null,
        numeroPaginas: paginasNum
      };

      if (editingLivro) {
        await livrosService.atualizar(editingLivro.id, payload);
        showSuccess('Livro atualizado com sucesso!');
      } else {
        await livrosService.criar(payload);
        showSuccess('Livro criado com sucesso!');
      }

      setShowForm(false);
      setEditingLivro(null);
      carregarLivros();
    } catch (err) {
      // livrosService lança Error com message e possivelmente details (via handleResponseError)
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

  if (loading) {
    return <div className="loading">Carregando livros...</div>;
  }

  return (
    <div className="container">
      <div className="livros-header">
        <h1>Meus Livros</h1>
        <button onClick={handleCreate} className="btn btn-primary">
          ➕ Adicionar Livro
        </button>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {livros.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum livro cadastrado ainda.</p>
          <button onClick={handleCreate} className="btn btn-primary">
            Adicionar seu primeiro livro
          </button>
        </div>
      ) : (
        <div className="livros-grid">
          {livros.map((livro) => (
            <LivroCard key={livro.id} livro={livro} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showForm && <LivroForm livro={editingLivro} onSubmit={handleSubmit} onCancel={handleCancel} />}
    </div>
  );
};

export default Livros;
