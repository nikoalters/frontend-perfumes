import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const CommentsSection = () => {
  const [comments, setComments] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const user = JSON.parse(localStorage.getItem('userInfo'));

  // Cargar comentarios al iniciar
  const fetchComments = async () => {
    try {
      const res = await fetch('https://api-perfumes-chile.onrender.com/api/comments');
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Enviar comentario
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch('https://api-perfumes-chile.onrender.com/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ comentario: nuevoComentario }),
      });

      if (res.ok) {
        setNuevoComentario('');
        fetchComments(); // Recargar lista
        Swal.fire({
          icon: 'success',
          title: '¡Gracias!',
          text: 'Tu comentario ha sido publicado.',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        throw new Error('Error al comentar');
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo enviar el comentario' });
    }
  };

  return (
    <div className="container my-5 py-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '15px' }}>
      <h3 className="text-center mb-4 fw-bold" style={{ color: '#333' }}>💬 Lo que dicen nuestros clientes</h3>

      {/* LISTA DE COMENTARIOS */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-8">
          {comments.length === 0 ? (
            <p className="text-center text-muted">Sé el primero en dejar un comentario.</p>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
              {comments.map((c) => (
                <div key={c._id} className="card mb-3 shadow-sm border-0">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold text-primary mb-0">👤 {c.name}</h6>
                        <small className="text-muted" style={{fontSize:'0.8rem'}}>
                            {new Date(c.createdAt).toLocaleDateString()}
                        </small>
                    </div>
                    <p className="card-text text-dark">{c.comentario}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FORMULARIO (SOLO SI ESTÁ LOGUEADO) */}
      <div className="row justify-content-center">
        <div className="col-md-8">
          {user ? (
            <form onSubmit={submitHandler} className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Escribe tu experiencia con nosotros..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-success fw-bold">
                Enviar
              </button>
            </form>
          ) : (
            <div className="alert alert-warning text-center">
              🔒 Debes <a href="/login" className="alert-link">iniciar sesión</a> para dejar un comentario.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;