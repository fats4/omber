# RENAOMBER Discord Setup Bot

Script otomatis untuk setup struktur server Discord komunitas brand RENAOMBER (role, channel, permission, pesan welcome).

## Persiapan (sekali saja)

### 1. Buat server Discord kosong

1. Buka Discord → klik **+** → **Create My Own** → **For a club or community**
2. Beri nama **RENAOMBER**

### 2. Buat bot di Developer Portal

1. Buka [Discord Developer Portal](https://discord.com/developers/applications)
2. **New Application** → nama: `RENAOMBER Setup`
3. Tab **Bot** → **Reset Token** → salin token
4. Aktifkan **Server Members Intent** (opsional, untuk fitur lanjutan)

### 3. Invite bot ke server

Ganti `CLIENT_ID` dengan Application ID (tab General Information):

```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot
```

Permission `8` = Administrator (diperlukan untuk setup).

### 4. Aktifkan Developer Mode & salin Server ID

1. Discord → **User Settings** → **Advanced** → **Developer Mode** ON
2. Klik kanan server → **Copy Server ID**

### 5. Konfigurasi environment

```bash
cd discord
cp .env.example .env
```

Edit `.env`:

```env
DISCORD_TOKEN=token_bot_kamu
GUILD_ID=id_server_kamu
WEBSITE_URL=https://renaomber.com
INSTAGRAM_URL=https://instagram.com/renaomber
TIKTOK_URL=https://tiktok.com/@renaomber
```

**Penting — wajib sebelum setup:**

1. Invite bot dengan permission **Administrator**
2. Buka **Server Settings → Roles**
3. **Tarik role bot ke PALING ATAS** (lebih tinggi dari semua role lain, termasuk @everyone)
4. Klik **Save Changes**

Tanpa langkah ini, setup akan gagal dengan error `Missing Permissions`.

## Menjalankan setup

```bash
cd discord
npm install
npm run setup
```

Script akan:
- Membuat role (Owner, Admin, Mod, VIP, Member, dll.)
- Membuat kategori & channel
- Mengatur permission (readonly, community, staff-only)
- Memposting pesan di #welcome, #rules, #links, #role-select, #support

Jalankan ulang aman — channel/role yang sudah ada akan di-skip.

## Setelah setup

1. Assign role **Owner** ke akun kamu (Server Settings → Members)
2. Upload icon & banner brand
3. Buat invite link permanen (Never expire)
4. (Opsional) Tambah [Carl-bot](https://carl.gg/) atau Reaction Roles untuk #role-select
