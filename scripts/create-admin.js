/**
 * SCRIPT: Crear usuario admin en Supabase Auth
 * Ejecutar: node scripts/create-admin.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function createAdmin() {
  const email = 'admin@directorio.site';
  const password = 'Admin123456!';

  console.log('Creando usuario admin...');

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('El usuario admin ya existe');
      console.log('Email:', email);
      console.log('Password:', password);
      return;
    }
    console.error('Error:', error.message);
    return;
  }

  console.log('Usuario admin creado exitosamente');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('User ID:', data.user.id);
}

createAdmin();
