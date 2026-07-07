export const ROLES = [
  { name: 'Owner', color: 0x8b0000, hoist: true },
  { name: 'Admin', color: 0xe74c3c, hoist: true },
  { name: 'Moderator', color: 0xe67e22, hoist: true },
  { name: 'Team', color: 0x2d5016, hoist: true },
  { name: 'VIP', color: 0xf1c40f, hoist: true },
  { name: 'Member', color: 0x95a5a6, hoist: false },
  { name: 'Muted', color: 0x2c2f33, hoist: false },
  { name: 'Drop Alerts', color: 0xff6b6b, hoist: false },
  { name: 'Events', color: 0x74b9ff, hoist: false },
  { name: 'Collectors', color: 0xa29bfe, hoist: false },
  { name: 'Streetwear', color: 0x55efc4, hoist: false },
]

/** Urutan hierarki role (bawah → atas) */
export const ROLE_HIERARCHY = [
  'Member',
  'Drop Alerts',
  'Events',
  'Collectors',
  'Streetwear',
  'Muted',
  'VIP',
  'Team',
  'Moderator',
  'Admin',
  'Owner',
]

export const STAFF_ROLES = ['Owner', 'Admin', 'Moderator', 'Team']

export const CATEGORIES = [
  {
    name: '📢 INFORMASI',
    channels: [
      { name: 'welcome', type: 'readonly', message: 'welcome' },
      { name: 'announcements', type: 'readonly' },
      { name: 'rules', type: 'readonly', message: 'rules' },
      { name: 'faq', type: 'readonly' },
      { name: 'links', type: 'readonly', message: 'links' },
      { name: 'role-select', type: 'readonly', message: 'roleSelect' },
    ],
  },
  {
    name: '💬 KOMUNITAS',
    channels: [
      { name: 'general', type: 'community' },
      { name: 'introductions', type: 'community' },
      { name: 'fit-check', type: 'community' },
      { name: 'memes', type: 'community' },
      { name: 'feedback', type: 'community' },
    ],
  },
  {
    name: '🎙️ VOICE CHAT',
    channels: [
      { name: 'general-lounge', kind: 'voice', type: 'voice-community' },
      { name: 'hangout', kind: 'voice', type: 'voice-community' },
      { name: 'music-chill', kind: 'voice', type: 'voice-community' },
      { name: 'vip-lounge', kind: 'voice', type: 'voice-vip' },
      { name: 'staff-room', kind: 'voice', type: 'voice-staff' },
    ],
  },
  {
    name: '🛍️ PRODUK & DROP',
    channels: [
      { name: 'drop-alerts', type: 'readonly' },
      { name: 'pre-order', type: 'readonly' },
      { name: 'product-talk', type: 'community' },
      { name: 'restock-wishlist', type: 'community' },
      { name: 'marketplace', type: 'community' },
    ],
  },
  {
    name: '🎨 COLLECTIBLES',
    channels: [
      { name: 'collectibles', type: 'community' },
      { name: 'grail-talk', type: 'community' },
      { name: 'collection-flex', type: 'community' },
    ],
  },
  {
    name: '🎉 EVENTS',
    channels: [
      { name: 'events', type: 'readonly' },
      { name: 'event-chat', type: 'community' },
      { name: 'giveaways', type: 'readonly' },
    ],
  },
  {
    name: '🎫 SUPPORT',
    channels: [
      { name: 'support', type: 'community', message: 'support' },
      { name: 'order-status', type: 'community' },
      { name: 'bug-report', type: 'community' },
    ],
  },
  {
    name: '🔒 STAFF ONLY',
    channels: [
      { name: 'staff-chat', type: 'staff' },
      { name: 'mod-log', type: 'staff' },
      { name: 'drop-planning', type: 'staff' },
      { name: 'bot-log', type: 'staff' },
    ],
  },
]

export function getMessages(links) {
  const { website, instagram, tiktok } = links

  return {
    welcome: `Selamat datang di **RENAOMBER** 👋

Komunitas resmi untuk streetwear, collectibles, dan drop terbaru.

📌 Baca <#rules> dulu
🛒 Website: ${website}
📸 Instagram: ${instagram}
🎵 TikTok: ${tiktok}
🔔 Ambil role di <#role-select> untuk notifikasi drop

Enjoy & stay fresh.`,

    rules: `**Aturan Server RENAOMBER**

1. Respect everyone — no hate, harassment, or drama
2. No spam, self-promo, or DM random selling
3. Stay on topic per channel
4. No leaks / fake info about drops
5. Buy & sell hanya di channel yang ditentukan
6. Follow Discord ToS
7. Keputusan mod final

Pelanggaran = warn / mute / ban`,

    links: `**Link Resmi RENAOMBER**

🛒 Store: ${website}
📸 Instagram: ${instagram}
🎵 TikTok: ${tiktok}
💬 Discord: kamu sudah di sini ✓`,

    roleSelect: `**Pilih Notifikasi**

React di bawah (atau minta admin assign role):

🔴 **Drop Alerts** — notifikasi produk baru & restock
🔵 **Events** — info event & pop-up store
🟣 **Collectors** — diskusi collectibles
🟢 **Streetwear** — diskusi fashion & style

*Untuk auto role, tambahkan bot seperti Carl-bot atau Reaction Roles.*`,

    support: `**Butuh Bantuan?**

Kirim pesan dengan info berikut:
• Order ID / email
• Masalah yang dialami
• Screenshot (jika ada)

Tim akan balas dalam **24–48 jam**.`,
  }
}
