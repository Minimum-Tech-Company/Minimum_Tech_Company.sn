import { Router } from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

// ========== SERVICES ==========

// Public
router.get('/services', (req, res) => {
  const services = db.prepare('SELECT * FROM services WHERE active = 1 ORDER BY display_order ASC').all();
  res.json(services);
});

// Admin
router.get('/admin/services', authenticateToken, (req, res) => {
  const services = db.prepare('SELECT * FROM services ORDER BY display_order ASC').all();
  res.json(services);
});

router.post('/admin/services', authenticateToken, upload.single('image'), (req, res) => {
  const { title, description, icon, link, display_order, active } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const result = db.prepare(
    'INSERT INTO services (title, description, icon, link, image, display_order, active) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(title, description, icon || 'FiBriefcase', link || null, image, display_order || 0, active !== undefined ? active : 1);

  res.json({ id: result.lastInsertRowid, message: 'Service créé' });
});

router.put('/admin/services/:id', authenticateToken, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, description, icon, link, display_order, active } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  db.prepare(
    'UPDATE services SET title=?, description=?, icon=?, link=?, image=?, display_order=?, active=? WHERE id=?'
  ).run(title, description, icon, link, image, display_order || 0, active !== undefined ? active : 1, id);

  res.json({ message: 'Service mis à jour' });
});

router.delete('/admin/services/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
  res.json({ message: 'Service supprimé' });
});

// ========== PROJECTS ==========

// Public
router.get('/projects', (req, res) => {
  const projects = db.prepare('SELECT * FROM projects WHERE active = 1 ORDER BY display_order ASC').all();
  res.json(projects);
});

router.get('/projects/:category', (req, res) => {
  const projects = db.prepare('SELECT * FROM projects WHERE category = ? AND active = 1 ORDER BY display_order ASC')
    .all(req.params.category);
  res.json(projects);
});

// Admin
router.get('/admin/projects', authenticateToken, (req, res) => {
  const projects = db.prepare('SELECT * FROM projects ORDER BY display_order ASC').all();
  res.json(projects);
});

router.post('/admin/projects', authenticateToken, upload.single('image'), (req, res) => {
  const { title, description, category, link, tech_stack, display_order, active } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const result = db.prepare(
    'INSERT INTO projects (title, description, category, image, link, tech_stack, display_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(title, description, category || 'realisation', image, link || null, tech_stack || null, display_order || 0, active !== undefined ? active : 1);

  res.json({ id: result.lastInsertRowid, message: 'Projet créé' });
});

router.put('/admin/projects/:id', authenticateToken, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, description, category, link, tech_stack, display_order, active } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  db.prepare(
    'UPDATE projects SET title=?, description=?, category=?, image=?, link=?, tech_stack=?, display_order=?, active=? WHERE id=?'
  ).run(title, description, category, image, link, tech_stack, display_order || 0, active !== undefined ? active : 1, id);

  res.json({ message: 'Projet mis à jour' });
});

router.delete('/admin/projects/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ message: 'Projet supprimé' });
});

// ========== FUTURE PROJECTS ==========

// Public
router.get('/future-projects', (req, res) => {
  const projects = db.prepare('SELECT * FROM future_projects WHERE active = 1 ORDER BY display_order ASC').all();
  res.json(projects);
});

// Admin
router.get('/admin/future-projects', authenticateToken, (req, res) => {
  const projects = db.prepare('SELECT * FROM future_projects ORDER BY display_order ASC').all();
  res.json(projects);
});

router.post('/admin/future-projects', authenticateToken, upload.single('image'), (req, res) => {
  const { title, description, link, expected_date, display_order, active } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const result = db.prepare(
    'INSERT INTO future_projects (title, description, image, link, expected_date, display_order, active) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(title, description, image, link || null, expected_date || null, display_order || 0, active !== undefined ? active : 1);

  res.json({ id: result.lastInsertRowid, message: 'Projet futur créé' });
});

router.put('/admin/future-projects/:id', authenticateToken, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, description, link, expected_date, display_order, active } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  db.prepare(
    'UPDATE future_projects SET title=?, description=?, image=?, link=?, expected_date=?, display_order=?, active=? WHERE id=?'
  ).run(title, description, image, link, expected_date, display_order || 0, active !== undefined ? active : 1, id);

  res.json({ message: 'Projet futur mis à jour' });
});

router.delete('/admin/future-projects/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM future_projects WHERE id = ?').run(req.params.id);
  res.json({ message: 'Projet futur supprimé' });
});

// ========== BLOG ==========

// Public
router.get('/blog', (req, res) => {
  const posts = db.prepare('SELECT * FROM blog_posts WHERE published = 1 ORDER BY display_order ASC, created_at DESC').all();
  res.json(posts);
});

router.get('/blog/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ? AND published = 1').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Article non trouvé' });
  res.json(post);
});

// Admin
router.get('/admin/blog', authenticateToken, (req, res) => {
  const posts = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
  res.json(posts);
});

router.post('/admin/blog', authenticateToken, upload.single('image'), (req, res) => {
  const { title, content, excerpt, tags, link, published, display_order } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const result = db.prepare(
    'INSERT INTO blog_posts (title, content, excerpt, image, tags, link, published, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(title, content, excerpt || null, image, tags || null, link || null, published !== undefined ? published : 0, display_order || 0);

  res.json({ id: result.lastInsertRowid, message: 'Article créé' });
});

router.put('/admin/blog/:id', authenticateToken, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, content, excerpt, tags, link, published, display_order } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  db.prepare(
    'UPDATE blog_posts SET title=?, content=?, excerpt=?, image=?, tags=?, link=?, published=?, display_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).run(title, content, excerpt, image, tags, link, published !== undefined ? published : 0, display_order || 0, id);

  res.json({ message: 'Article mis à jour' });
});

router.delete('/admin/blog/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM blog_posts WHERE id = ?').run(req.params.id);
  res.json({ message: 'Article supprimé' });
});

// ========== HERO ==========

router.get('/hero', (req, res) => {
  const hero = db.prepare('SELECT * FROM hero WHERE active = 1 ORDER BY id DESC LIMIT 1').get();
  res.json(hero || { title: 'Bienvenue', subtitle: 'Solutions technologiques innovantes' });
});

router.get('/admin/hero', authenticateToken, (req, res) => {
  const heroes = db.prepare('SELECT * FROM hero ORDER BY id DESC').all();
  res.json(heroes);
});

router.post('/admin/hero', authenticateToken, upload.single('background_image'), (req, res) => {
  const { title, subtitle, description, cta_text, cta_link, active } = req.body;
  const background_image = req.file ? `/uploads/${req.file.filename}` : null;

  if (active === '1' || active === 1) {
    db.prepare('UPDATE hero SET active = 0').run();
  }

  const result = db.prepare(
    'INSERT INTO hero (title, subtitle, description, cta_text, cta_link, background_image, active) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(title, subtitle || null, description || null, cta_text || 'Découvrir', cta_link || '/services', background_image, active !== undefined ? active : 1);

  res.json({ id: result.lastInsertRowid, message: 'Hero créé' });
});

router.put('/admin/hero/:id', authenticateToken, upload.single('background_image'), (req, res) => {
  const { id } = req.params;
  const { title, subtitle, description, cta_text, cta_link, active } = req.body;
  const background_image = req.file ? `/uploads/${req.file.filename}` : req.body.background_image;

  if (active === '1' || active === 1) {
    db.prepare('UPDATE hero SET active = 0').run();
  }

  db.prepare(
    'UPDATE hero SET title=?, subtitle=?, description=?, cta_text=?, cta_link=?, background_image=?, active=? WHERE id=?'
  ).run(title, subtitle, description, cta_text, cta_link, background_image, active !== undefined ? active : 1, id);

  res.json({ message: 'Hero mis à jour' });
});

router.delete('/admin/hero/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM hero WHERE id = ?').run(req.params.id);
  res.json({ message: 'Hero supprimé' });
});

// ========== COMPANY INFO ==========

router.get('/company', (req, res) => {
  const infos = db.prepare('SELECT * FROM company_info').all();
  const infoObj = {};
  infos.forEach(info => { infoObj[info.key] = info.value; });
  res.json(infoObj);
});

router.get('/admin/company', authenticateToken, (req, res) => {
  const infos = db.prepare('SELECT * FROM company_info ORDER BY key ASC').all();
  res.json(infos);
});

router.put('/admin/company', authenticateToken, (req, res) => {
  const stmt = db.prepare('UPDATE company_info SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?');
  const updates = Object.entries(req.body);

  const transaction = db.transaction(() => {
    for (const [key, value] of updates) {
      stmt.run(value, key);
    }
  });

  transaction();
  res.json({ message: 'Informations mises à jour' });
});

// ========== CONTACT ==========

router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nom, email et message requis' });
  }

  db.prepare('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)')
    .run(name, email, subject || null, message);

  res.json({ message: 'Message envoyé avec succès' });
});

router.get('/admin/contact', authenticateToken, (req, res) => {
  const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
  res.json(messages);
});

router.put('/admin/contact/:id/read', authenticateToken, (req, res) => {
  db.prepare('UPDATE contact_messages SET read = 1 WHERE id = ?').run(req.params.id);
  res.json({ message: 'Message marqué comme lu' });
});

router.delete('/admin/contact/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
  res.json({ message: 'Message supprimé' });
});

// ========== DASHBOARD STATS ==========

router.get('/admin/stats', authenticateToken, (req, res) => {
  const services = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
  const projects = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
  const futureProjects = db.prepare('SELECT COUNT(*) as count FROM future_projects').get().count;
  const blogPosts = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get().count;
  const messages = db.prepare('SELECT COUNT(*) as count FROM contact_messages').get().count;
  const unreadMessages = db.prepare('SELECT COUNT(*) as count FROM contact_messages WHERE read = 0').get().count;

  res.json({ services, projects, futureProjects, blogPosts, messages, unreadMessages });
});

export default router;
