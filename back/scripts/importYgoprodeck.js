import axios from 'axios';
import connexion from '../config/bdd.js';

// Mapping vers votre schéma (FR)
const TYPE_MAP = (type) => {
  if (!type) return 'Monstre';
  const t = String(type).toLowerCase();
  if (t.includes('spell')) return 'Magie';
  if (t.includes('trap')) return 'Piège';
  return 'Monstre';
};

const ATTR_MAP = {
  LIGHT: 'LUMIERE',
  DARK: 'TENEBRES',
  EARTH: 'TERRE',
  WATER: 'EAU',
  FIRE: 'FEU',
  WIND: 'VENT',
  DIVINE: 'DIVIN'
};

const RARETE_MAP = {
  'Common': 'Commune',
  'Rare': 'Rare',
  'Super Rare': 'Super Rare',
  'Ultra Rare': 'Ultra Rare',
  'Secret Rare': 'Secrète'
};

function extractSetRoot(setCode) {
  if (!setCode) return null;
  const idx = setCode.indexOf('-');
  return idx > 0 ? setCode.slice(0, idx) : setCode;
}

async function upsertType(libelleType) {
  const [rows] = await connexion.query('SELECT idType FROM typecarte WHERE libelleType = ?', [libelleType]);
  if (rows.length) return rows[0].idType;
  const [res] = await connexion.query('INSERT INTO typecarte (libelleType) VALUES (?)', [libelleType]);
  return res.insertId;
}

async function upsertAttribut(libelleAttribut) {
  if (!libelleAttribut) return null;
  const [rows] = await connexion.query('SELECT idAttribut FROM attributcarte WHERE libelleAttribut = ?', [libelleAttribut]);
  if (rows.length) return rows[0].idAttribut;
  const [res] = await connexion.query('INSERT INTO attributcarte (libelleAttribut) VALUES (?)', [libelleAttribut]);
  return res.insertId;
}

async function upsertRarete(libelleRarete) {
  const [rows] = await connexion.query('SELECT idRarete FROM raretecarte WHERE libelleRarete = ?', [libelleRarete]);
  if (rows.length) return rows[0].idRarete;
  const [res] = await connexion.query('INSERT INTO raretecarte (libelleRarete) VALUES (?)', [libelleRarete]);
  return res.insertId;
}

async function upsertEdition(codeEdition, nomEdition) {
  const [rows] = await connexion.query('SELECT codeEdition FROM edition WHERE codeEdition = ?', [codeEdition]);
  if (rows.length) return codeEdition;
  await connexion.query('INSERT INTO edition (codeEdition, nomEdition) VALUES (?, ?)', [codeEdition, nomEdition || codeEdition]);
  return codeEdition;
}

async function importChunk(params = {}) {
  const url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
  const { num = 1, offset = 0 } = params; // pagination YGOPRODeck
  const { data } = await axios.get(url, { params: { num, offset } });
  const list = data?.data || [];

  for (const card of list) {
    try {
      const libelleType = TYPE_MAP(card.type);
      const idType = await upsertType(libelleType);

      const libAttr = ATTR_MAP[card.attribute] || null;
      const idAttribut = await upsertAttribut(libAttr);

      // Choisir un set (premier par défaut)
      const set = Array.isArray(card.card_sets) && card.card_sets.length ? card.card_sets[0] : null;
      const setRoot = set ? extractSetRoot(set.set_code) : null;
      const nomEdition = set?.set_name || setRoot;
      const codeEdition = setRoot || 'UNKNOWN';
      await upsertEdition(codeEdition, nomEdition);

      // Rareté (si dispo dans le set)
      const libelleRarete = set?.set_rarity ? (RARETE_MAP[set.set_rarity] || 'Commune') : 'Commune';
      const idRarete = await upsertRarete(libelleRarete);

      const imageUrl = Array.isArray(card.card_images) && card.card_images[0]?.image_url ? card.card_images[0].image_url : null;

      const nom = card.name || '';
      const description = card.desc || null;
      const niveau = card.level ?? null;
      const attaque = card.atk ?? null;
      const defense = card.def ?? null;

      // Insertion carte (éviter doublons par nom + édition)
      const [exists] = await connexion.query(
        'SELECT idCarte FROM carte WHERE nom = ? AND codeEdition = ? LIMIT 1',
        [nom, codeEdition]
      );
      if (exists.length) continue;

      await connexion.query(
        `INSERT INTO carte (nom, description, idType, idAttribut, niveau, attaque, defense, idRarete, imageUrl, codeEdition)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [nom, description, idType, idAttribut, niveau, attaque, defense, idRarete, imageUrl, codeEdition]
      );
    } catch (e) {
      console.error('Erreur import carte:', card?.name, e?.message);
    }
  }
}

async function main() {
  // Paramètres: total ~ 10000; on procède par chunks (ex: 100)
  const chunkSize = Number(process.env.CHUNK_SIZE || 100);
  const maxCards = Number(process.env.MAX_CARDS || 500); // limite par défaut pour éviter les longs imports

  let offset = 0;
  while (offset < maxCards) {
    console.log(`Import offset=${offset}, size=${chunkSize}`);
    await importChunk({ num: chunkSize, offset });
    offset += chunkSize;
  }

  console.log('Import terminé');
  process.exit(0);
}

main().catch((e) => {
  console.error('Erreur import:', e);
  process.exit(1);
});


