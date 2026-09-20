import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'database.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT 'Admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT 'FiBriefcase',
    link TEXT,
    image TEXT,
    display_order INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'realisation',
    image TEXT,
    link TEXT,
    tech_stack TEXT,
    display_order INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS future_projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    link TEXT,
    expected_date TEXT,
    display_order INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image TEXT,
    tags TEXT,
    link TEXT,
    published INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS hero (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    cta_text TEXT DEFAULT 'Découvrir',
    cta_link TEXT DEFAULT '/services',
    background_image TEXT,
    active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS company_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@minimumtech.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@2024';

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  if (!existing) {
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)').run(adminEmail, hashedPassword, 'Admin');
    console.log('Admin account created:', adminEmail);
  }
}

function seedCompanyInfo() {
  const infos = [
    { key: 'company_name', value: 'Minimum Tech' },
    { key: 'company_tagline', value: 'Solutions technologiques innovantes' },
    { key: 'company_description', value: 'Nous concevons des solutions numériques sur mesure pour propulser votre entreprise vers le succès.' },
    { key: 'company_email', value: 'contact@minimumtech.com' },
    { key: 'company_phone', value: '+243 000 000 000' },
    { key: 'company_address', value: 'Kinshasa, RDC' },
    { key: 'company_website', value: 'https://minimumtech.com' },
    { key: 'about_text', value: 'Minimum Tech est une entreprise technologique dédiée à l\'innovation et à l\'excellence. Nous transformons vos idées en solutions numériques performantes.' },
    { key: 'footer_text', value: '© 2024 Minimum Tech. Tous droits réservés.' },
  ];

  const stmt = db.prepare('INSERT OR IGNORE INTO company_info (key, value) VALUES (?, ?)');
  for (const info of infos) {
    stmt.run(info.key, info.value);
  }
}

function seedServices() {
  const count = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
  if (count > 0) return;

  const services = [
    {
      title: 'Business Intelligence',
      description: 'Tableaux de bord et visualisation de données pour une prise de décision éclairée. Nous concevons des dashboards interactifs avec Power BI, Tableau et d\'autres outils BI pour transformer vos données en insights stratégiques.',
      icon: 'FiBarChart2',
      link: '',
      display_order: 1
    },
    {
      title: 'Formation & Compétences',
      description: 'Formation de vos équipes sur les outils d\'analyse et de collecte de données : Power BI, SQL, Excel avancé, et bien plus. Programmes personnalisés adaptés à votre niveau et vos besoins métier.',
      icon: 'FiBookOpen',
      link: '',
      display_order: 2
    },
    {
      title: 'Création de Sites Web',
      description: 'Développement de sites web professionnels et d\'applications SaaS sur mesure. Sites vitrines, e-commerce, plateformes SaaS — nous créons votre présence numérique avec les technologies modernes.',
      icon: 'FiCode',
      link: '',
      display_order: 3
    }
  ];

  const stmt = db.prepare(
    'INSERT INTO services (title, description, icon, link, display_order, active) VALUES (?, ?, ?, ?, ?, 1)'
  );
  for (const s of services) {
    stmt.run(s.title, s.description, s.icon, s.link, s.display_order);
  }
  console.log('Services seeded');
}

function seedFutureProjects() {
  const count = db.prepare('SELECT COUNT(*) as count FROM future_projects').get().count;
  if (count > 0) return;

  const projects = [
    {
      title: 'Recherche sur les Robots Humanoïdes',
      description: 'Programme de recherche dédié au développement de robots humanoïdes intelligents. Exploration de l\'IA conversationnelle, de la vision par ordinateur, de la locomotion bipède et de l\'interaction homme-robot pour des applications en service, santé et industrie.',
      expected_date: 'En cours - Phase exploratoire',
      link: '',
      display_order: 1
    }
  ];

  const stmt = db.prepare(
    'INSERT INTO future_projects (title, description, expected_date, link, display_order, active) VALUES (?, ?, ?, ?, ?, 1)'
  );
  for (const p of projects) {
    stmt.run(p.title, p.description, p.expected_date, p.link, p.display_order);
  }
  console.log('Future projects seeded');
}

seedAdmin();
seedCompanyInfo();
seedServices();
seedFutureProjects();

export default db;
