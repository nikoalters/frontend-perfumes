import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const CommentsSection = () => {
  const [comments, setComments] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const user = JSON.parse(localStorage.getItem('userInfo'));

  // Cargar comentarios
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
        fetchComments();
        Swal.fire({
          icon: 'success',
          title: '¡Publicado!',
          text: 'Gracias por tu comentario.',
          timer: 1500,
          showConfirmButton: false,
          background: '#333', color: '#fff'
        });
      } else {
        throw new Error('Error al comentar');
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo enviar', background: '#333', color: '#fff' });
    }
  };

  return (
    <div className="container my-5 py-5 rounded-4 position-relative overflow-hidden" 
         style={{ 
             background: 'rgba(10, 10, 20, 0.6)', 
             backdropFilter: 'blur(10px)', 
             border: '1px solid rgba(255,255,255,0.05)',
             boxShadow: '0 0 40px rgba(0,0,0,0.5)'
         }}>
      
      {/* --- TÍTULO METAL LÍQUIDO ANIMADO --- */}
      <div className="text-center mb-5">
          <h3 className="fw-black display-6 text-uppercase" 
              style={{
                /* El Truco del Metal: Degradado de Verde Claro a Oscuro que se repite */
                backgroundImage: 'linear-gradient(to right, #a8ff78, #009970, #004d38, #009970, #a8ff78)', 
                backgroundSize: '200% auto',
                color: '#fff',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shine 4s linear infinite', // Velocidad del brillo
                fontWeight: '900',
                letterSpacing: '3px',
                filter: 'drop-shadow(0 0 5px rgba(0,153,112,0.5))' // Resplandor externo
              }}>
              Voces de la Comunidad
          </h3>
          <div style={{height: '2px', width: '100px', background: 'var(--color-principal)', margin: '10px auto', borderRadius: '2px'}}></div>
      </div>

      {/* LISTA DE COMENTARIOS */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-10 col-lg-8">
          {comments.length === 0 ? (
            <div className="text-center p-5 rounded border border-secondary border-opacity-25">
                <p className="text-muted mb-0">Aún no hay comentarios. ¡Tu opinión importa!</p>
            </div>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '15px' }} className="custom-scroll pe-2">
              {comments.map((c) => (
                <div key={c._id} className="card mb-3 border-0 shadow-sm position-relative overflow-hidden" 
                     style={{
                         background: 'rgba(255,255,255,0.03)', 
                         borderRadius: '15px'
                     }}>
                  
                  {/* Borde Lateral Neón (Login Style) */}
                  <div style={{
                      position: 'absolute',
                      top: 0, left: 0, bottom: 0,
                      width: '4px',
                      background: 'linear-gradient(to bottom, var(--color-principal), #00e5ff, #ff2a6d)'
                  }}></div>

                  <div className="card-body ps-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-3">
                            <span className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow" 
                                  style={{
                                      width: '40px', height: '40px', 
                                      background: 'linear-gradient(135deg, var(--color-principal), #00e5ff)',
                                      fontSize: '1rem'
                                  }}>
                                {c.name.charAt(0).toUpperCase()}
                            </span>
                            <div>
                                <h6 className="fw-bold mb-0 text-white">{c.name}</h6>
                                <div className="d-flex gap-1">
                                    <span style={{fontSize: '0.7rem', color: '#ffc107'}}>★★★★★</span>
                                </div>
                            </div>
                        </div>
                        <small className="text-secondary opacity-75" style={{fontSize:'0.75rem'}}>
                            {new Date(c.createdAt).toLocaleDateString()}
                        </small>
                    </div>
                    <p className="card-text text-light opacity-75 mt-2" style={{lineHeight: '1.6'}}>
                        "{c.comentario}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FORMULARIO */}
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          {user ? (
            <form onSubmit={submitHandler} className="position-relative">
              <input
                type="text"
                className="form-control bg-dark border-0 text-white shadow-lg py-3 ps-4 pe-5 rounded-pill"
                placeholder="Escribe tu experiencia..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                required
                style={{
                    background: 'rgba(0,0,0,0.4)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(5px)'
                }}
              />
              <button type="submit" className="btn position-absolute top-50 end-0 translate-middle-y me-2 rounded-pill px-4 fw-bold text-white shadow" 
                      style={{
                          background: 'linear-gradient(90deg, var(--color-principal), #00c48f)',
                          border: 'none',
                          height: '40px'
                      }}>
                Enviar
              </button>
            </form>
          ) : (
            <div className="text-center mt-3">
              <a href="/login" className="btn btn-sm btn-outline-light rounded-pill px-4 opacity-75">
                🔒 Inicia sesión para comentar
              </a>
            </div>
          )}
        </div>
      </div>

      {/* INYECTAMOS LA ANIMACIÓN CSS AQUÍ */}
      <style>{`
        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
    </div>
  );
};

export default CommentsSection;