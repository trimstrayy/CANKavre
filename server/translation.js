const { translate } = require('@vitalets/google-translate-api');

const TRANSLATION_ENABLED = process.env.TRANSLATION_ENABLED !== 'false';

// Source->target mappings used in committee/admin write flows.
const AUTO_TRANSLATE_FIELD_MAP = {
  title: 'titleNe',
  description: 'descriptionNe',
  content: 'contentNe',
  excerpt: 'excerptNe',
  category: 'categoryNe',
  location: 'locationNe',
  name: 'nameNe',
  position: 'positionNe',
};

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

async function translateToNepali(text) {
  const source = String(text || '').trim();
  if (!source) return '';
  if (!TRANSLATION_ENABLED) return source;

  try {
    const result = await translate(source, { to: 'ne' });
    return (result.text || '').trim() || source;
  } catch (error) {
    // Fail soft: never block saves because translation provider is unavailable.
    console.warn('[translation] Nepali translation failed:', error && error.message ? error.message : error);
    return source;
  }
}

/**
 * Fills target Nepali fields when source English fields are present and target is empty.
 * Does not overwrite explicit target values provided by the client.
 */
async function fillNepaliFields(payload) {
  const next = { ...payload };
  const tasks = [];

  for (const [sourceKey, targetKey] of Object.entries(AUTO_TRANSLATE_FIELD_MAP)) {
    if (!(sourceKey in next)) continue;
    if (!isBlank(next[targetKey])) continue;
    if (isBlank(next[sourceKey])) continue;

    tasks.push(
      translateToNepali(next[sourceKey]).then((translated) => {
        next[targetKey] = translated;
      })
    );
  }

  await Promise.all(tasks);
  return next;
}

module.exports = {
  fillNepaliFields,
};
