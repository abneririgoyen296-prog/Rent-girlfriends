'use client'

import { submitReview } from '../../../actions/reviews'
import { useState, use } from 'react'

export default function ReviewPage({ params }) {
  const { id } = use(params)
  const [rating, setRating] = useState(5)
  const [error, setError] = useState('')

  async function handleSubmit(formData) {
    const res = await submitReview(formData)
    if (res?.error) {
      setError(res.error)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto' }} className="card">
      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Calificar Compañía</h1>
      
      {error && <p className="error-msg">{error}</p>}
      
      <form action={handleSubmit}>
        <input type="hidden" name="bookingId" value={id} />
        <input type="hidden" name="rating" value={rating} />

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ marginBottom: '1rem' }}>¿Qué te pareció la experiencia?</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', fontSize: '2rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                onClick={() => setRating(star)} 
                style={{ cursor: 'pointer', color: star <= rating ? 'gold' : '#444' }}
              >
                ★
              </span>
            ))}
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>{rating} / 5</p>
        </div>

        <label>Comentario</label>
        <textarea 
          name="comment" 
          required 
          placeholder="Escribe aquí tu reseña..."
          rows="5"
          style={{ width: '100%', padding: '0.8rem', background: 'var(--secondary)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', marginBottom: '1rem' }}
        ></textarea>

        <button type="submit" style={{ width: '100%', background: 'var(--primary)' }}>Enviar Reseña</button>
      </form>
    </div>
  )
}
