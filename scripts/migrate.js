/**
 * SCRIPT DE MIGRACIÓN: CSV → Supabase
 *
 * Uso:
 *   1. Instalar dependencias: npm install csv-parser @supabase/supabase-js dotenv
 *   2. Configurar variables en .env (ver .env.example)
 *   3. Ejecutar: node scripts/migrate.js
 *
 * Lee BaseDatos.csv y contacts.csv, y los inserta en Supabase.
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Configura SUPABASE_URL y SUPABASE_SERVICE_KEY en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BATCH_SIZE = 500;

async function migrateBaseDatos() {
  console.log('\n=== Migrando BaseDatos.csv ===');
  const results = [];
  const seen = new Set();

  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'BaseDatos.csv'))
      .pipe(csv())
      .on('data', (row) => {
        const nombre = row['Nombre']?.trim();
        if (!nombre || nombre === 'Nombre') return;

        const documento = row['Documento']?.trim();
        const key = `${nombre}|${documento}`;
        if (seen.has(key)) return;
        seen.add(key);

        results.push({
          foto_url: row['Foto']?.trim() || null,
          nombre_completo: nombre,
          documento: documento || null,
          programa: row['Programa']?.trim() || null,
          rol: row['Rol']?.trim() || null,
          correo_personal: row['Correo']?.trim() || null,
          correo_trabajo: null,
          telefono_celular: null,
          redes_sociales: { wa: '', ig: '', fb: '' },
          tags: [],
          ciudad: null,
          latitud: null,
          longitud: null,
          fecha_nacimiento: null,
          detalles: [],
          codigo_universidad: null,
        });
      })
      .on('end', async () => {
        console.log(`  ${results.length} contactos leídos de BaseDatos.csv`);
        await insertBatch(results, 'BaseDatos.csv');
        resolve();
      })
      .on('error', reject);
  });
}

async function migrateContacts() {
  console.log('\n=== Migrando contacts.csv ===');
  const results = [];
  const seen = new Set();

  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'contacts.csv'))
      .pipe(csv())
      .on('data', (row) => {
        const firstName = row['First Name']?.trim() || '';
        const middleName = row['Middle Name']?.trim() || '';
        const lastName = row['Last Name']?.trim() || '';
        const nickname = row['Nickname']?.trim() || '';

        let nombre = [firstName, middleName, lastName].filter(Boolean).join(' ');
        if (!nombre && nickname) nombre = nickname;
        if (!nombre) return;

        const key = nombre.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);

        const email1 = row['E-mail 1 - Value']?.trim() || null;
        const email2 = row['E-mail 2 - Value']?.trim() || null;
        const phone = row['Phone 1 - Value']?.trim() || null;
        const birthday = row['Birthday']?.trim() || null;
        const labels = row['Labels']?.trim() || '';
        const notes = row['Notes']?.trim() || '';
        const photo = row['Photo']?.trim() || null;
        const city = row['Address 1 - City']?.trim() || null;
        const org = row['Organization Name']?.trim() || null;

        const tags = [];
        if (labels) {
          labels.split(':::').forEach(t => {
            const cleaned = t.replace(/\*/g, '').trim();
            if (cleaned && cleaned !== 'myContacts') {
              tags.push(cleaned);
            }
          });
        }
        if (org) tags.push(org);

        const birthdayFormatted = birthday && birthday.startsWith('--')
          ? `2000${birthday}`
          : birthday || null;

        results.push({
          foto_url: photo && photo.startsWith('http') ? photo : null,
          nombre_completo: nombre,
          documento: null,
          programa: org || null,
          rol: null,
          correo_personal: email1,
          correo_trabajo: email2,
          telefono_celular: phone,
          redes_sociales: { wa: '', ig: '', fb: '' },
          tags: tags,
          ciudad: city,
          latitud: null,
          longitud: null,
          fecha_nacimiento: birthdayFormatted,
          detalles: [],
          codigo_universidad: null,
        });
      })
      .on('end', async () => {
        console.log(`  ${results.length} contactos leídos de contacts.csv`);
        await insertBatch(results, 'contacts.csv');
        resolve();
      })
      .on('error', reject);
  });
}

async function insertBatch(contacts, source) {
  let inserted = 0;
  for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
    const batch = contacts.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase
      .from('directorio')
      .insert(batch);

    if (error) {
      console.error(`  Error en batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message);
    } else {
      inserted += batch.length;
      process.stdout.write(`  Insertados: ${inserted}/${contacts.length}\r`);
    }
  }
  console.log(`\n  Total insertados de ${source}: ${inserted}`);
}

async function main() {
  console.log('Iniciando migración a Supabase...');
  console.log(`URL: ${supabaseUrl}`);

  await migrateBaseDatos();
  await migrateContacts();

  console.log('\n=== Migración completada ===');

  const { count } = await supabase
    .from('directorio')
    .select('*', { count: 'exact', head: true });
  console.log(`Total registros en tabla: ${count}`);
}

main().catch(console.error);
