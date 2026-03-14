import { getContext } from '@keystone-6/core/context';
import config from './keystone';
import * as PrismaModule from '.prisma/client';


export const socialGroups = [
  'Autismus-Spektrum',
  'Autoimmunerkrankung (z.B. HIV)',
  'blinde und sehbehinderte Personen',
  'cis-männlich',
  'cis-weiblich',
  'Drogenkonsument*innen',
  'Erfahrung sexualisierter Gewalt',
  'Indigene Personen',
  'Juden_Jüdinnen',
  'körperlich behindert',
  'gehörlose und hörbehinderte Personen',
  'nichtbinär',
  'Muslim*innen',
  'Migrant*innen',
  'mehrgewichtige und hochgewichtige Personen',
  'neurodivergent',
  'Personen mit Autoimmunerkrankungen',
  'psychische Erkrankung',
  'chronische Erkrankung',
  'Personen mit Herz-Kreislauf-Erkrankungen',
  'Personen mit Skelett-/Muskelerkrankungen',
  'Personen mit Stoffwechselerkrankungen',
  'Personen mit Erkrankungen des Verdauungssystems',
  'People of Color (Personen, die Rassismus erfahren)',
  'Personen mit Spastiken',
  'Personen mit Lernschwierigkeiten / sog. geistige Behinderung',
  'queer/lesbisch/schwul/bi/pan',
  'Schwarze Personen',
  'Rom*nja/Sinti*zze',
  'Rollstuhlnutzende / Personen mit Mobilitätseinschränkungen',
  'trans',
  'trans Weiblichkeiten',
  'wenigergewichtige Personen',
  'trans Männlichkeiten',
  'weiß',
];

export async function create_social_groups() {
  const context = getContext(config, PrismaModule)

   console.log(` Inserting seed data for social groups 🌍♿️👱🏻‍♀️👩🏻‍🦰👩🏻👧🏽👧🏾🏳️‍🌈 `);
   
   for (const group of socialGroups) {
    
    let existing = await context.query.SocialGroup.findOne({
        where: { name: group },
        query: 'id',
      });

        if (!existing) {
            await context.query.SocialGroup.createOne({
                data: { name: group },
                query: 'id',
            });
        }
   }
   console.log(`✅ Seed data for social groups inserted successfully!`);
}