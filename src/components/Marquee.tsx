import './Marquee.css';

const messages = [
  'DROP BARU — PRE-ORDER TERBATAS',
  'SEMUA PENJUALAN FINAL',
  'PENGIRIMAN INTERNASIONAL TERSEDIA',
  'DAFTAR EMAIL UNTUK DROP SELANJUTNYA',
];

export function Marquee() {
  const text = messages.join('  ◆  ');

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
