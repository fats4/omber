import './Newsletter.css';

export function Newsletter() {
  return (
    <section className="newsletter">
      <div className="newsletter__inner">
        <div className="newsletter__text">
          <h2>Join the drop list</h2>
          <p>Email kamu = akses pertama ke rilis berikutnya.</p>
        </div>

        <form
          className="newsletter__form"
          onSubmit={(e) => {
            e.preventDefault();
            alert('Thanks! Kamu sudah terdaftar.');
          }}
        >
          <label htmlFor="email" className="visually-hidden">
            Email
          </label>
          <input id="email" type="email" placeholder="email@example.com" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
