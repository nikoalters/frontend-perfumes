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
          showConfirmButton: false,
          background: '#333', color: '#fff' // Alerta oscura
        });
      } else {
        throw new Error('Error al comentar');
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo enviar el comentario', background: '#333', color: '#fff' });
    }
  };

  return (
    // CONTENEDOR DARK GLASS
    <div className="container my-5 py-5 rounded-4" 
         style={{ 
             background: 'rgba(0, 0, 0, 0.3)', 
             backdropFilter: 'blur(10px)', 
             border: '1px solid rgba(255,255,255,0.05)' 
         }}>
      
      <h3 className="text-center mb-5 fw-bold text-white">💬 Experiencias de Clientes</h3>

      {/* LISTA DE COMENTARIOS */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-9">
          {comments.length === 0 ? (
            <div className="text-center p-4 rounded border border-secondary border-opacity-25">
                <p className="text-muted mb-0">Aún no hay comentarios. ¡Sé el primero!</p>
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }} className="custom-scroll">
              {comments.map((c) => (
                <div key={c._id} className="card mb-3 border-0 shadow-sm" style={{background: 'rgba(255,255,255,0.05)'}}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        {/* Nombre en Verde Neón */}
                        <div className="d-flex align-items-center gap-2">
                            <span className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" 
                                  style={{width: '30px', height: '30px', background: 'var(--color-principal)', fontSize: '0.8rem'}}>
                                {c.name.charAt(0).toUpperCase()}
                            </span>
                            <h6 className="fw-bold mb-0 text-white">{c.name}</h6>
                        </div>
                        <small className="text-secondary" style={{fontSize:'0.75rem'}}>
                            {new Date(c.createdAt).toLocaleDateString()}
                        </small>
                    </div>
                    <p className="card-text text-light opacity-75 ps-2 border-start border-success border-2">{c.comentario}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FORMULARIO */}
      <div className="row justify-content-center">
        <div className="col-md-9">
          {user ? (
            <form onSubmit={submitHandler} className="d-flex gap-2 bg-dark p-2 rounded-pill border border-secondary border-opacity-50">
              <input
                type="text"
                className="form-control bg-transparent border-0 text-white shadow-none ps-3"
                placeholder="Escribe tu experiencia con nosotros..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                required
                style={{color: 'white'}}
              />
              <button type="submit" className="btn rounded-pill px-4 fw-bold text-white" 
                      style={{background: 'var(--color-principal)', border: 'none'}}>
                Enviar
              </button>
            </form>
          ) : (
            <div className="alert text-center border-0" style={{background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107'}}>
              🔒 Debes <a href="/login" className="fw-bold text-decoration-none" style={{color: '#ffca2c'}}>iniciar sesión</a> para dejar un comentario.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;