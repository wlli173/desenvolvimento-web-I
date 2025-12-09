import React, { useEffect, useState } from "react";
import reviewsService from "../services/reviewsService";
import ReviewModal from "../components/ReviewModal";
import "./ReviewsPage.css";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await reviewsService.getAll();
      // Verifique a estrutura da resposta
      console.log("Resposta da API:", res);

      // Se a resposta for um objeto com propriedade data
      if (res && res.data) {
        setReviews(res.data); // array de reviews
      } else {
        // Se for diretamente o array
        setReviews(res);
      }
    } catch (err) {
      console.error("Erro ao carregar reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h2>📖 Reviews da Comunidade</h2>
      </div>

      {loading ? (
        <p>Carregando reviews...</p>
      ) : reviews.length === 0 ? (
        <p>Nenhuma review encontrada.</p>
      ) : (
        <ul className="reviews-list">
          {reviews.map((review) => (
            <li key={review.id} className="review-item">
              <h3>{review.livro_titulo || review.titulo || "Livro sem título"}</h3>
              {review.autor && (
                <p className="review-author">
                  📚 <strong>Autor:</strong> {review.autor}
                </p>
              )}
              <p className="review-author">
                ✍️ <strong>{review.username || "Usuário"}</strong>
              </p>
              <p className="review-text">{review.conteudo}</p>
              {review.created_at && (
                <p className="review-date">
                  📅 {new Date(review.created_at).toLocaleDateString('pt-BR')}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

};

export default ReviewsPage;
