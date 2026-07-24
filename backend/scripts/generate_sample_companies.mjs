// One-off helper script: resolves real German addresses via the Nominatim
// geocoding API and writes { name, trade, contact, address, size, verified,
// latitude, longitude } records to backend/sample_companies.json for use by
// seed_data.ts. Re-run only if you want to regenerate the sample data set;
// respects Nominatim's 1 req/sec usage policy, so it takes a few minutes.
//
// Run with: node scripts/generate_sample_companies.mjs (from backend/)

const GERMAN_CITIES = [
  { city: 'Berlin', plz: '10115' },
  { city: 'Hamburg', plz: '20095' },
  { city: 'München', plz: '80331' },
  { city: 'Köln', plz: '50667' },
  { city: 'Frankfurt am Main', plz: '60311' },
  { city: 'Stuttgart', plz: '70173' },
  { city: 'Düsseldorf', plz: '40210' },
  { city: 'Leipzig', plz: '04109' },
  { city: 'Dortmund', plz: '44135' },
  { city: 'Essen', plz: '45127' },
  { city: 'Bremen', plz: '28195' },
  { city: 'Dresden', plz: '01067' },
  { city: 'Hannover', plz: '30159' },
  { city: 'Nürnberg', plz: '90402' },
  { city: 'Duisburg', plz: '47051' },
  { city: 'Bochum', plz: '44787' },
  { city: 'Wuppertal', plz: '42103' },
  { city: 'Bielefeld', plz: '33602' },
  { city: 'Bonn', plz: '53111' },
  { city: 'Münster', plz: '48143' },
  { city: 'Karlsruhe', plz: '76133' },
  { city: 'Mannheim', plz: '68159' },
  { city: 'Augsburg', plz: '86150' },
  { city: 'Wiesbaden', plz: '65183' },
  { city: 'Mönchengladbach', plz: '41061' },
  { city: 'Gelsenkirchen', plz: '45879' },
  { city: 'Braunschweig', plz: '38100' },
  { city: 'Kiel', plz: '24103' },
  { city: 'Chemnitz', plz: '09111' },
  { city: 'Aachen', plz: '52062' },
  { city: 'Halle (Saale)', plz: '06108' },
  { city: 'Magdeburg', plz: '39104' },
  { city: 'Freiburg im Breisgau', plz: '79098' },
  { city: 'Krefeld', plz: '47798' },
  { city: 'Lübeck', plz: '23552' },
  { city: 'Oberhausen', plz: '46045' },
  { city: 'Erfurt', plz: '99084' },
  { city: 'Mainz', plz: '55116' },
  { city: 'Rostock', plz: '18055' },
  { city: 'Kassel', plz: '34117' },
];

const STREET_NAMES = [
  'Hauptstraße', 'Bahnhofstraße', 'Schulstraße', 'Gartenstraße', 'Bergstraße',
  'Kirchstraße', 'Waldstraße', 'Ringstraße', 'Poststraße', 'Mühlenweg',
  'Industriestraße', 'Birkenweg', 'Lindenstraße', 'Goethestraße',
  'Schillerstraße', 'Friedrichstraße', 'Königstraße', 'Rathausplatz',
];

const SURNAMES = [
  'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner',
  'Becker', 'Schulz', 'Hoffmann', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf',
  'Schröder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun', 'Krüger', 'Hofmann',
  'Hartmann', 'Lange', 'Werner', 'Krause', 'Peters', 'Möller', 'Vogel', 'Fuchs',
];

const TRADES = [
  { name: 'Elektrotechnik', suffix: 'Elektro' },
  { name: 'Sanitär, Heizung, Klima', suffix: 'Haustechnik' },
  { name: 'Tischlerei', suffix: 'Tischlerei' },
  { name: 'Kfz-Mechatronik', suffix: 'Kfz-Technik' },
  { name: 'Maler und Lackierer', suffix: 'Malerbetrieb' },
  { name: 'Dachdeckerei', suffix: 'Dach' },
  { name: 'Zimmerei', suffix: 'Zimmerei' },
  { name: 'Metallbau', suffix: 'Metallbau' },
  { name: 'Bäckerei', suffix: 'Bäckerei' },
  { name: 'Friseurhandwerk', suffix: 'Friseure' },
  { name: 'Gebäudereinigung', suffix: 'Gebäudeservice' },
  { name: 'Landschaftsgärtnerei', suffix: 'Garten- und Landschaftsbau' },
  { name: 'Fliesenlegerei', suffix: 'Fliesen' },
  { name: 'Schreinerei', suffix: 'Schreinerei' },
  { name: 'Anlagenmechanik', suffix: 'Anlagenbau' },
  { name: 'Maurerhandwerk', suffix: 'Bau' },
  { name: 'Straßenbau', suffix: 'Straßenbau' },
  { name: 'Glaserei', suffix: 'Glaserei' },
  { name: 'Steinmetzhandwerk', suffix: 'Steinmetzbetrieb' },
  { name: 'Installationstechnik', suffix: 'Installationstechnik' },
];

const LEGAL_FORMS = ['GmbH', 'GmbH & Co. KG', 'e.K.', 'OHG', 'Meisterbetrieb', ''];
const COMPANY_SIZES = ['_1to5', '_5to10', '_10to30', '_30to50', '_50to250', '_250plus'];

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildCompanyName(surname, trade, legalForm, used) {
  let name;
  let attempts = 0;
  do {
    const lf = attempts > 5 ? `${legalForm} ${attempts}` : legalForm;
    name = lf ? `${surname} ${trade.suffix} ${lf}` : `${surname} ${trade.suffix}`;
    attempts++;
  } while (used.has(name) && attempts < 50);
  used.add(name);
  return name;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function nominatimSearch(params) {
  const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
    ...params,
    format: 'json',
    limit: '1',
    countrycodes: 'de',
    addressdetails: '1',
  })}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Betriebsradar-SampleDataGenerator/1.0 (mail@moritzhalm.de)' },
  });
  const data = await res.json();
  await sleep(1100); // respect Nominatim's 1 req/sec usage policy
  return data[0] ?? null;
}

// Try decreasing house numbers, then drop the house number, to find a real,
// geocodable address on a real street in the given city.
async function resolveRealAddress(street, city, plz) {
  const houseNumbers = [
    1 + Math.floor(Math.random() * 60),
    1 + Math.floor(Math.random() * 30),
    1 + Math.floor(Math.random() * 15),
    1,
  ];

  for (const houseNumber of houseNumbers) {
    const hit = await nominatimSearch({
      street: `${houseNumber} ${street}`,
      city,
      postalcode: plz,
    });
    if (hit) {
      const addr = hit.address ?? {};
      const resolvedStreet = addr.road ?? street;
      const resolvedHouseNumber = addr.house_number ?? String(houseNumber);
      const resolvedPlz = addr.postcode ?? plz;
      const resolvedCity = addr.city ?? addr.town ?? addr.village ?? city;
      return {
        address: `${resolvedStreet} ${resolvedHouseNumber}, ${resolvedPlz} ${resolvedCity}`,
        latitude: parseFloat(hit.lat),
        longitude: parseFloat(hit.lon),
      };
    }
  }

  // Fall back to the street itself (no house number) - still a real location.
  const streetHit = await nominatimSearch({ street, city, postalcode: plz });
  if (streetHit) {
    const addr = streetHit.address ?? {};
    const resolvedCity = addr.city ?? addr.town ?? addr.village ?? city;
    return {
      address: `${addr.road ?? street}, ${addr.postcode ?? plz} ${resolvedCity}`,
      latitude: parseFloat(streetHit.lat),
      longitude: parseFloat(streetHit.lon),
    };
  }

  return null;
}

async function main() {
  const count = 100;
  const usedNames = new Set();
  const companies = [];
  let cityIndex = 0;

  while (companies.length < count) {
    const surname = pickRandom(SURNAMES);
    const trade = pickRandom(TRADES);
    const legalForm = pickRandom(LEGAL_FORMS);
    const name = buildCompanyName(surname, trade, legalForm, usedNames);

    // Cycle through cities so every city is represented before repeating.
    const { city, plz } = GERMAN_CITIES[cityIndex % GERMAN_CITIES.length];
    cityIndex++;
    const street = pickRandom(STREET_NAMES);

    process.stdout.write(`[${companies.length + 1}/${count}] Resolving "${street}" in ${city}... `);
    let resolved;
    try {
      resolved = await resolveRealAddress(street, city, plz);
    } catch (err) {
      console.log(`error: ${err}`);
      continue;
    }

    if (!resolved) {
      console.log('not found, retrying with a different street/city');
      continue;
    }
    console.log(`-> ${resolved.address} (${resolved.latitude}, ${resolved.longitude})`);

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9äöüß]+/g, '-')
      .replace(/(^-|-$)/g, '');

    companies.push({
      name,
      trade: trade.name,
      contact: `info@${slug}.de`,
      address: resolved.address,
      size: pickRandom(COMPANY_SIZES),
      verified: Math.random() < 0.7,
      latitude: resolved.latitude,
      longitude: resolved.longitude,
    });
  }

  const fs = await import('node:fs');
  fs.writeFileSync(
    new URL('../sample_companies.json', import.meta.url),
    JSON.stringify(companies, null, 2) + '\n'
  );
  console.log(`\nWrote ${companies.length} companies to ../sample_companies.json`);
}

main();
