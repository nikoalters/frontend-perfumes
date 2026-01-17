import React from 'react';

const AboutSection = () => {
  return (
    <div className="container my-5 pt-5 border-top border-secondary border-opacity-25">
      
      {/* 1. TÍTULO */}
      <div className="text-center mb-5">
        <h2 className="fw-bolder display-5 mb-3" 
            style={{
                background: 'linear-gradient(to right, #fff, var(--color-principal), #00e5ff)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                letterSpacing: '2px'
            }}>
            ¿QUIÉNES SOMOS?
        </h2>
        <p className="lead text-secondary mx-auto" style={{ maxWidth: '700px', fontSize: '1.1rem' }}>
          Somos <strong className="text-white">Perfumes Chile</strong>. Nuestra misión es democratizar el lujo, 
          entregando fragancias <span style={{color: '#00e5ff'}}>100% originales</span> con despacho rápido y la atención que mereces.
        </p>
      </div>

      
      {/* 2. TARJETAS ELÉCTRICAS (Estilo NikoAlters) */}
      <div className="row text-center mb-5 g-4">
        
        {/* Card 1: VERDE */}
        <div className="col-md-4">
          <div className="card-feature card-feature-green p-4 h-100 d-flex flex-column justify-content-center align-items-center">
            {/* La máscara que tapa el centro */}
            <div className="card-content-mask"></div>
            
            {/* Contenido (encima de la máscara) */}
            <div className="mb-3 d-inline-block p-3 rounded-circle shadow-lg" style={{background: 'rgba(0, 153, 112, 0.2)', zIndex: 2}}>
                <i className="bi bi-patch-check-fill" style={{ fontSize: '2.5rem', color: '#009970' }}></i>
            </div>
            <h4 className="fw-bold text-white mt-2" style={{zIndex: 2}}>100% Originales</h4>
            <p className="text-secondary small mt-3 mb-0" style={{zIndex: 2}}>
                Garantía absoluta de autenticidad. Productos sellados, con celofán y código de lote verificable. Sin imitaciones.
            </p>
          </div>
        </div>

        {/* Card 2: CIAN */}
        <div className="col-md-4">
          <div className="card-feature card-feature-cyan p-4 h-100 d-flex flex-column justify-content-center align-items-center">
             {/* La máscara */}
            <div className="card-content-mask"></div>

            <div className="mb-3 d-inline-block p-3 rounded-circle shadow-lg" style={{background: 'rgba(0, 229, 255, 0.2)', zIndex: 2}}>
                <i className="bi bi-rocket-takeoff-fill" style={{ fontSize: '2.5rem', color: '#00e5ff' }}></i>
            </div>
            <h4 className="fw-bold text-white mt-2" style={{zIndex: 2}}>Envíos Flash</h4>
            <p className="text-secondary small mt-3 mb-0" style={{zIndex: 2}}>
                Santiago Urbano en 24-48hrs. Regiones vía Starken/Chilexpress con número de seguimiento en tiempo real.
            </p>
          </div>
        </div>

        {/* Card 3: ROSA/VIOLETA */}
        <div className="col-md-4">
          <div className="card-feature card-feature-pink p-4 h-100 d-flex flex-column justify-content-center align-items-center">
             {/* La máscara */}
            <div className="card-content-mask"></div>

            <div className="mb-3 d-inline-block p-3 rounded-circle shadow-lg" style={{background: 'rgba(255, 42, 109, 0.2)', zIndex: 2}}>
                <i className="bi bi-shield-lock-fill" style={{ fontSize: '2.5rem', color: '#ff2a6d' }}></i>
            </div>
            <h4 className="fw-bold text-white mt-2" style={{zIndex: 2}}>Compra Directa</h4>
            <p className="text-secondary small mt-3 mb-0" style={{zIndex: 2}}>
                Trato directo y personalizado. Paga vía Transferencia Bancaria sin comisiones ocultas y con confirmación inmediata.
            </p>
          </div>
        </div>
      </div>

      
      {/* SECCIÓN CONTACTO Y FAQ (Sin cambios) */}
      <div className="row align-items-start p-4 rounded-4 shadow-lg border border-secondary border-opacity-10" 
           style={{background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)'}}>
        <div className="col-md-5 mb-5 mb-md-0 text-center text-md-start">
            <h3 className="fw-bold mb-3 text-white">📱 ¿Necesitas Ayuda?</h3>
            <p className="text-secondary mb-4">
                ¿Buscas un aroma específico o necesitas asesoría para un regalo especial? Habla directamente con nosotros.
            </p>
            <div className="d-flex flex-column gap-3">
                <a href="https://wa.me/56958547236" target="_blank" rel="noreferrer" 
                   className="btn btn-lg fw-bold text-white shadow d-flex align-items-center justify-content-center justify-content-md-start gap-3 rounded-pill" 
                   style={{background: 'linear-gradient(90deg, #25D366, #128C7E)', border: 'none'}}>
                    <i className="bi bi-whatsapp fs-4"></i> <span>Escríbenos al WhatsApp</span>
                </a>
                <a href="https://www.instagram.com/nico_alters?igsh=em9xb2NuN2h6NTc=" target="_blank" rel="noreferrer" 
                   className="btn btn-lg fw-bold text-white shadow d-flex align-items-center justify-content-center justify-content-md-start gap-3 rounded-pill" 
                   style={{background: 'linear-gradient(45deg, #f09433 0%, #dc2743 50%, #bc1888 100%)', border: 'none'}}>
                    <i className="bi bi-instagram fs-4"></i> <span>Síguenos en Instagram</span>
                </a>
            </div>
            <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
                <p className="mb-0 text-white-50 small fw-bold"><i className="bi bi-telephone-inbound me-2 text-success"></i> +56 9 5854 7236</p>
            </div>
        </div>
        <div className="col-md-7 ps-md-5">
            <h5 className="fw-bold mb-4 text-white d-flex align-items-center gap-2"><span className="badge bg-dark border border-secondary rounded-pill">?</span> Preguntas Frecuentes</h5>
            <div className="accordion accordion-flush" id="accordionFAQ">
                <div className="accordion-item bg-transparent mb-3 border-0">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed rounded-3 text-white fw-semibold shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#faq1" style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}>💎 ¿Son originales?</button>
                    </h2>
                    <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#accordionFAQ"><div className="accordion-body text-secondary small pt-2">Absolutamente. No trabajamos con imitaciones.</div></div>
                </div>
                <div className="accordion-item bg-transparent mb-3 border-0">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed rounded-3 text-white fw-semibold shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#faq2" style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}>🚚 ¿Tiempos de envío?</button>
                    </h2>
                    <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#accordionFAQ"><div className="accordion-body text-secondary small pt-2">Santiago: 24-48 hrs. Regiones: 2-5 días hábiles.</div></div>
                </div>
                <div className="accordion-item bg-transparent mb-3 border-0">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed rounded-3 text-white fw-semibold shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#faq3" style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}>💸 ¿Cómo puedo pagar?</button>
                    </h2>
                    <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#accordionFAQ"><div className="accordion-body text-secondary small pt-2">Solo <strong className="text-white">Transferencia Bancaria</strong> por ahora.</div></div>
                </div>
            </div>
        </div>
      </div>
      
      <style>{`
        .accordion-button::after { filter: invert(1); }
        .accordion-button:not(.collapsed) { background-color: rgba(0, 153, 112, 0.2) !important; color: white !important; }
      `}</style>
    </div>
  );
};

export default AboutSection;