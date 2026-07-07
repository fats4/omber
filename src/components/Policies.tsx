import './Policies.css';

const policies = [
  {
    title: 'All Sales Final',
    text: 'Tidak ada refund atau exchange. Pastikan ukuran dan alamat pengiriman sudah benar sebelum checkout.',
  },
  {
    title: 'Shipping',
    text: 'Pengiriman internasional tersedia. Bea cukai dan biaya tambahan menjadi tanggung jawab pembeli.',
  },
  {
    title: 'Lost Packages',
    text: 'Kami tidak dapat mengganti paket yang hilang atau dicuri. Hubungi kurir dengan nomor tracking untuk klaim.',
  },
  {
    title: 'Support',
    text: 'Hubungi kami dalam 14 hari setelah menerima pesanan jika ada masalah dengan order kamu.',
  },
];

export function Policies() {
  return (
    <section className="policies" id="policies">
      <div className="policies__header" id="about">
        <p className="policies__eyebrow">Before you buy</p>
        <h2>Store Policies</h2>
      </div>

      <div className="policies__grid">
        {policies.map((policy) => (
          <article key={policy.title} className="policies__card">
            <h3>{policy.title}</h3>
            <p>{policy.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
