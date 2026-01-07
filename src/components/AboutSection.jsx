import React from 'react';

const AboutSection = () => {
  return (
    <div className="container my-5 pt-5 border-top">
      {/* 1. ENCABEZADO */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-success display-6">¿Quiénes Somos?</h2>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
          Somos <strong>Perfumes Chile</strong>. Nuestra misión es democratizar el lujo, 
          entregando fragancias 100% originales con despacho rápido y seguro a todo el país.
        </p>
      </div>

      {/* 2. PILARES DE CONFIANZA (ICONOS) */}
      <div className="row text-center mb-5 g-4">
        <div className="col-md-4">
          <div className="p-4 bg-light rounded-3 shadow-sm h-100 border border-success border-opacity-25">
            <i className="bi bi-patch-check-fill text-success" style={{ fontSize: '3rem' }}></i>
            <h4 className="fw-bold mt-3">100% Originales</h4>
            <p className="text-muted small">Garantizamos autenticidad. Productos sellados y con código de lote verificable.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 bg-light rounded-3 shadow-sm h-100 border border-primary border-opacity-25">
            <i className="bi bi-truck text-primary" style={{ fontSize: '3rem' }}></i>
            <h4 className="fw-bold mt-3">Envíos Rápidos</h4>
            <p className="text-muted small">Despachamos en 24-48hrs en Santiago. Envíos a regiones vía Starken/Chilexpress.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 bg-light rounded-3 shadow-sm h-100 border border-warning border-opacity-25">
            <i className="bi bi-shield-lock-fill text-warning" style={{ fontSize: '3rem' }}></i>
            <h4 className="fw-bold mt-3">Compra Segura</h4>
            <p className="text-muted small">Tus datos están protegidos. Paga con transferencia o WebPay con total tranquilidad.</p>
          </div>
        </div>
      </div>

      {/* 3. SECCIÓN MIXTA: CONTACTO + FAQ */}
      <div className="row align-items-start bg-white p-4 rounded-3 shadow-sm border">
        
        {/* LADO IZQUIERDO: CONTACTO (ACTUALIZADO SOLO WSP E INSTAGRAM) */}
        <div className="col-md-5 mb-4 mb-md-0 text-center text-md-start">
            <h3 className="fw-bold mb-3">📱 ¡Hablemos!</h3>
            <p className="text-muted">¿Buscas un aroma específico o necesitas asesoría para un regalo? Escríbenos.</p>
            
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                {/* Botón WhatsApp */}
                <a href="https://wa.me/56958547236" target="_blank" rel="noreferrer" className="btn btn-success btn-lg fw-bold text-white shadow-sm border-0" style={{backgroundColor: '#25D366'}}>
                    <i className="bi bi-whatsapp me-2"></i> WhatsApp
                </a>
                
                {/* Botón Instagram (Nuevo estilo degradado) */}
                <a href="https://www.instagram.com/perfumeschile" target="_blank" rel="noreferrer" className="btn btn-lg fw-bold text-white shadow-sm border-0" 
                   style={{background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'}}>
                    <i className="bi bi-instagram me-2"></i> Instagram
                </a>
            </div>
            
            <p className="mt-3 mb-0 text-success fw-bold small">
                <i className="bi bi-telephone-inbound me-2"></i> +56 9 5854 7236
            </p>
        </div>

        {/* LADO DERECHO: PREGUNTAS FRECUENTES (Acordeón) */}
        <div className="col-md-7">
            <h5 className="fw-bold mb-3 text-secondary border-bottom pb-2">Preguntas Frecuentes</h5>
            <div className="accordion accordion-flush" id="accordionFAQ">
                
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed bg-light rounded mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                            🧐 ¿Los perfumes son originales?
                        </button>
                    </h2>
                    <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                        <div className="accordion-body text-muted small">
                            Sí, absolutamente. Todos nuestros perfumes son 100% originales, vienen en su caja sellada y con celofán intacto (salvo los testers que se indican explícitamente).
                        </div>
                    </div>
                </div>

                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed bg-light rounded mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                            🚚 ¿Cuánto demora el envío?
                        </button>
                    </h2>
                    <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                        <div className="accordion-body text-muted small">
                            En Santiago Urbano entregamos al día hábil siguiente de tu compra. Para regiones, los tiempos dependen del courier (usualmente 2 a 5 días hábiles).
                        </div>
                    </div>
                </div>

                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed bg-light rounded" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                            💳 ¿Qué medios de pago aceptan?
                        </button>
                    </h2>
                    <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                        <div className="accordion-body text-muted small">
                            Aceptamos tarjetas de Crédito y Débito a través de WebPay Plus, y también Transferencia Bancaria Directa.
                        </div>
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};

export default AboutSection;