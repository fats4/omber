import 'dotenv/config'
import {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionFlagsBits,
} from 'discord.js'
import {
  ROLES,
  ROLE_HIERARCHY,
  STAFF_ROLES,
  CATEGORIES,
  getMessages,
} from './config.mjs'

const token = process.env.DISCORD_TOKEN
const guildId = process.env.GUILD_ID

if (!token || !guildId) {
  console.error('❌ Set DISCORD_TOKEN dan GUILD_ID di file .env')
  console.error('   Copy dari .env.example → .env')
  process.exit(1)
}

const links = {
  website: process.env.WEBSITE_URL ?? 'https://renaomber.com',
  instagram: process.env.INSTAGRAM_URL ?? 'https://instagram.com/renaomber',
  tiktok: process.env.TIKTOK_URL ?? 'https://tiktok.com/@renaomber',
}

const messages = getMessages(links)

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function assertBotCanSetup(guild) {
  const me = guild.members.me
  const botRole = me.roles.highest
  const needed = [
    PermissionFlagsBits.Administrator,
    PermissionFlagsBits.ManageRoles,
    PermissionFlagsBits.ManageChannels,
  ]

  const missing = needed.filter((perm) => !me.permissions.has(perm))
  if (missing.length > 0) {
    throw new Error(
      'Bot tidak punya permission Administrator.\n' +
        'Invite ulang dengan link admin:\n' +
        'https://discord.com/api/oauth2/authorize?client_id=APP_ID&permissions=8&scope=bot',
    )
  }

  const rolesAboveBot = guild.roles.cache.filter(
    (role) => role.id !== botRole.id && role.position >= botRole.position,
  )

  if (rolesAboveBot.size > 0) {
    const names = [...rolesAboveBot.values()]
      .sort((a, b) => b.position - a.position)
      .slice(0, 5)
      .map((r) => `"${r.name}"`)
      .join(', ')

    throw new Error(
      `Role bot "${botRole.name}" terlalu rendah (posisi ${botRole.position}).\n` +
        `Role di atas bot: ${names}\n\n` +
        'Perbaiki:\n' +
        '1. Server Settings → Roles\n' +
        '2. Tarik role bot ke PALING ATAS (di atas semua role lain)\n' +
        '3. Save → jalankan "npm run setup" lagi',
    )
  }

  if (botRole.position < ROLE_HIERARCHY.length) {
    throw new Error(
      `Role bot perlu minimal posisi ${ROLE_HIERARCHY.length}, saat ini ${botRole.position}.\n` +
        'Tarik role bot ke paling atas di Server Settings → Roles.',
    )
  }

  console.log(`✓ Bot OK — role "${botRole.name}" posisi ${botRole.position}\n`)
}

async function runStep(label, fn) {
  try {
    return await fn()
  } catch (err) {
    const detail = err.rawError?.message ?? err.message
    throw new Error(`${label}: ${detail}`)
  }
}

async function getOrCreateRole(guild, roleDef, existing) {
  const found = existing.find((r) => r.name === roleDef.name)
  if (found) {
    console.log(`  ↳ Role "${roleDef.name}" sudah ada, skip`)
    return found
  }

  const role = await guild.roles.create({
    name: roleDef.name,
    color: roleDef.color,
    hoist: roleDef.hoist,
    reason: 'RENAOMBER server setup',
  })
  console.log(`  ✓ Role "${roleDef.name}" dibuat`)
  await sleep(300)
  return role
}

async function positionRoles(guild, roleMap) {
  const botPosition = guild.members.me.roles.highest.position
  let positioned = 0

  // Atur dari atas ke bawah agar tidak bentrok posisi
  for (let i = ROLE_HIERARCHY.length - 1; i >= 0; i--) {
    const name = ROLE_HIERARCHY[i]
    const role = roleMap[name]
    if (!role) continue

    const targetPosition = botPosition - 1 - (ROLE_HIERARCHY.length - 1 - i)
    if (targetPosition < 1) continue
    if (role.position === targetPosition) continue

    await role.setPosition(targetPosition, { reason: 'RENAOMBER server setup' })
    positioned++
    await sleep(400)
  }

  if (positioned > 0) {
    console.log(`  ✓ Hierarki role diatur (${positioned} role dipindah)`)
  } else {
    console.log('  ↳ Hierarki role sudah benar, skip')
  }
}

function staffOverwrites(guild, roleMap, { voice = false } = {}) {
  const botRole = guild.members.me.roles.highest

  const textAllow = [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ManageMessages,
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.AttachFiles,
  ]

  const voiceAllow = [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.Connect,
    PermissionFlagsBits.Speak,
    PermissionFlagsBits.Stream,
    PermissionFlagsBits.MuteMembers,
    PermissionFlagsBits.MoveMembers,
    PermissionFlagsBits.DeafenMembers,
  ]

  return STAFF_ROLES.map((name) => {
    const role = roleMap[name]
    if (!role) return null
    if (role.position >= botRole.position) return null

    return {
      id: role.id,
      allow: voice ? voiceAllow : textAllow,
    }
  }).filter(Boolean)
}

function buildOverwrites(guild, roleMap, type, kind = 'text') {
  const everyone = guild.roles.everyone
  const isVoice = kind === 'voice'
  const staff = staffOverwrites(guild, roleMap, { voice: isVoice })

  if (type === 'staff' || type === 'voice-staff') {
    if (staff.length === 0) {
      throw new Error(
        'Channel staff butuh role bot di atas role Staff/Admin. Tarik role bot ke paling atas.',
      )
    }
    return [
      { id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
      ...staff,
    ]
  }

  if (type === 'voice-vip') {
    const vip = roleMap.VIP
    const vipAllow = [
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.Connect,
      PermissionFlagsBits.Speak,
      PermissionFlagsBits.Stream,
    ]
    const overwrites = [
      { id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
      ...staff,
    ]
    if (vip && vip.position < guild.members.me.roles.highest.position) {
      overwrites.push({ id: vip.id, allow: vipAllow })
    }
    return overwrites
  }

  if (type === 'voice-community') {
    return [
      {
        id: everyone.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.Connect,
          PermissionFlagsBits.Speak,
          PermissionFlagsBits.Stream,
          PermissionFlagsBits.UseVAD,
        ],
      },
    ]
  }

  if (type === 'readonly') {
    return [
      {
        id: everyone.id,
        deny: [PermissionFlagsBits.SendMessages],
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.AddReactions,
        ],
      },
      ...staff,
    ]
  }

  return [
    {
      id: everyone.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.AddReactions,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.EmbedLinks,
      ],
    },
  ]
}

async function getOrCreateCategory(guild, name, existingCategories) {
  const found = existingCategories.find((c) => c.name === name)
  if (found) {
    console.log(`  ↳ Kategori "${name}" sudah ada, skip`)
    return found
  }

  const category = await guild.channels.create({
    name,
    type: ChannelType.GuildCategory,
    reason: 'RENAOMBER server setup',
  })
  console.log(`  ✓ Kategori "${name}" dibuat`)
  await sleep(300)
  return category
}

async function getOrCreateChannel(guild, channelDef, category, roleMap, existingChannels) {
  const kind = channelDef.kind ?? 'text'
  const channelType = kind === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText
  const prefix = kind === 'voice' ? '🔊' : '#'

  const found = existingChannels.find(
    (c) => c.name === channelDef.name && c.parentId === category.id && c.type === channelType,
  )
  if (found) {
    console.log(`    ↳ ${prefix}${channelDef.name} sudah ada, skip`)
    return found
  }

  const channel = await guild.channels.create({
    name: channelDef.name,
    type: channelType,
    parent: category.id,
    permissionOverwrites: buildOverwrites(guild, roleMap, channelDef.type, kind),
    reason: 'RENAOMBER server setup',
  })
  console.log(`    ✓ ${prefix}${channelDef.name} dibuat`)
  await sleep(300)
  return channel
}

async function postMessage(channel, content) {
  const recent = await channel.messages.fetch({ limit: 5 })
  const alreadyPosted = recent.some(
    (m) => m.author.id === client.user.id && m.content.includes('RENAOMBER'),
  )
  if (alreadyPosted) {
    console.log(`    ↳ Pesan di #${channel.name} sudah ada, skip`)
    return
  }
  await channel.send(content)
  console.log(`    ✓ Pesan diposting di #${channel.name}`)
}

async function setup() {
  const guild = await client.guilds.fetch(guildId)
  await guild.fetch()
  await guild.roles.fetch()

  console.log(`\n🚀 Setup server: ${guild.name}\n`)

  assertBotCanSetup(guild)

  console.log('📋 Membuat role...')
  const roleMap = {}
  for (const roleDef of ROLES) {
    roleMap[roleDef.name] = await runStep(`Role "${roleDef.name}"`, () =>
      getOrCreateRole(guild, roleDef, guild.roles.cache),
    )
  }

  await runStep('Atur hierarki role', () => positionRoles(guild, roleMap))
  await guild.roles.fetch()
  for (const name of Object.keys(roleMap)) {
    roleMap[name] = guild.roles.cache.find((r) => r.name === name) ?? roleMap[name]
  }

  console.log('\n📁 Membuat kategori & channel...')
  await guild.channels.fetch()
  const categories = guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory)
  const existingChannels = guild.channels.cache.filter(
    (c) =>
      c.type === ChannelType.GuildText || c.type === ChannelType.GuildVoice,
  )

  const channelRefs = {}

  for (const catDef of CATEGORIES) {
    const category = await runStep(`Kategori "${catDef.name}"`, () =>
      getOrCreateCategory(guild, catDef.name, categories),
    )
    for (const chDef of catDef.channels) {
      const channel = await runStep(`Channel ${chDef.name}`, () =>
        getOrCreateChannel(guild, chDef, category, roleMap, existingChannels),
      )
      channelRefs[chDef.name] = channel
    }
  }

  const rulesChannel = channelRefs.rules
  const roleSelectChannel = channelRefs['role-select']
  const welcomeContent = messages.welcome
    .replace('<#rules>', rulesChannel ? `<#${rulesChannel.id}>` : '#rules')
    .replace('<#role-select>', roleSelectChannel ? `<#${roleSelectChannel.id}>` : '#role-select')

  console.log('\n💬 Memposting pesan...')
  for (const catDef of CATEGORIES) {
    for (const chDef of catDef.channels) {
      if (!chDef.message) continue
      const channel = channelRefs[chDef.name]
      const content =
        chDef.message === 'welcome' ? welcomeContent : messages[chDef.message]
      await runStep(`Pesan #${chDef.name}`, () => postMessage(channel, content))
    }
  }

  console.log('\n✅ Setup selesai!')
  console.log('\nLangkah berikutnya:')
  console.log('  1. Assign role Owner/Admin ke akun kamu')
  console.log('  2. Upload icon & banner server')
  console.log('  3. Buat invite link permanen')
  console.log('  4. (Opsional) Tambah bot reaction role untuk #role-select\n')
}

client.once('ready', async () => {
  try {
    await setup()
  } catch (err) {
    console.error('\n❌ Setup gagal:', err.message)
    process.exit(1)
  } finally {
    client.destroy()
    process.exit(0)
  }
})

client.login(token)
