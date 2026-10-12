#!/usr/bin/env python3
"""Build locale/en/LC_MESSAGES/django.po + .mo from template {% trans %} strings."""
import re
from pathlib import Path
import polib

BASE = Path(__file__).resolve().parent
TEMPLATES = BASE / 'templates'
LOCALE_EN = BASE / 'locale' / 'en' / 'LC_MESSAGES'

# French msgid -> English translation
EN = {
    # base.html
    "Accueil": "Home",
    "Services": "Services",
    "Réalisations": "Projects",
    "Recherche": "Research",
    "Blog": "Blog",
    "Contact": "Contact",
    "Changer de theme": "Toggle theme",
    "Navigation": "Navigation",
    "Solutions technologiques innovantes pour propulser votre entreprise.": "Innovative technology solutions to propel your business forward.",
    "Kinshasa, RDC": "Kinshasa, DRC",
    "2025 Minimum Tech. Tous droits reserves.": "2025 Minimum Tech. All rights reserved.",
    # index.html
    "Solutions Technologiques": "Technology Solutions",
    "Innovation Technologique": "Technological Innovation",
    "Transformez votre vision en": "Turn your vision into",
    "réalité numérique": "digital reality",
    "Nous concevons des solutions numériques sur mesure pour propulser votre entreprise vers le succès.": "We design custom digital solutions to propel your business to success.",
    "Découvrir nos services": "Explore our services",
    "Nous contacter": "Contact us",
    "Data • AI and ML • Développement • Recherche": "Data • AI and ML • Development • Research",
    "Nos technologies": "Our technologies",
    "Nos Services": "Our Services",
    "Des solutions sur mesure": "Tailored solutions",
    "Des prestations complètes pour répondre à tous vos besoins technologiques": "Complete services to meet all your technology needs",
    "En savoir plus": "Learn more",
    "Voir tous les services": "See all services",
    "État actuel": "Current state",
    "Nos projets": "Our projects",
    "Découvrez les projets que nous avons menés à bien": "Discover the projects we have successfully delivered",
    "Voir le projet": "View project",
    "Toutes les réalisations": "All projects",
    "Collaborations": "Collaborations",
    "Partenariats & collaborations": "Partnerships & collaborations",
    "Les projets que nous menons avec nos partenaires": "The projects we run with our partners",
    "Voir les collaborations": "See collaborations",
    "Pourquoi Minimum Tech": "Why Minimum Tech",
    "Plus qu'une entreprise,<br>une vocation.": "More than a company,<br>a calling.",
    "Un écosystème technologique": "A technological ecosystem",
    "Nous œuvrons à bâtir un écosystème technologique local : startups, talents et institutions réunis autour d'une même ambition — faire du Senegal un acteur de l'innovation numérique en Afrique.": "We work to build a local technological ecosystem: startups, talent and institutions united around a single ambition — making Senegal a player in digital innovation in Africa.",
    "Recherche en IA &amp; robotique": "AI &amp; robotics research",
    "Nous investissons dans la recherche appliquée en intelligence artificielle et en robotique, pour concevoir des solutions de demain dès aujourd'hui et rester à la pointe de l'innovation.": "We invest in applied research in artificial intelligence and robotics, to design tomorrow's solutions today and stay at the cutting edge of innovation.",
    "Un impact concret": "A concrete impact",
    "Données, développement web, formations : chaque projet que nous menons traduit cette vision en résultats mesurables pour nos clients et notre communauté.": "Data, web development, training: every project we undertake turns this vision into measurable results for our clients and our community.",
    "Prêt à démarrer votre projet ?": "Ready to start your project?",
    "Contactez-nous pour discuter de vos besoins et obtenir une solution sur mesure.": "Contact us to discuss your needs and get a tailored solution.",
    "Démarrer un projet": "Start a project",
    # services.html
    "Des solutions technologiques complètes pour propulser votre entreprise": "Complete technology solutions to propel your business",
    "Tous": "All",
    "Aucun service dans cette catégorie.": "No service in this category.",
    # service_detail.html
    "Description": "Description",
    "Objectif": "Objective",
    "Voir plus en détail": "See more details",
    "Retour aux services": "Back to services",
    "Nos Réalisations": "Our Projects",
    "Projets & Partenariats": "Projects & Partnerships",
    "Découvrez nos réalisations et collaborations": "Discover our projects and collaborations",
    # realisations.html
    "Toutes": "All",
    "Aucune réalisation pour le moment.": "No projects yet.",
    # futurs_projets.html
    "Projets Futurs": "Future Projects",
    "Découvrez les innovations que nous préparons": "Discover the innovations we are preparing",
    "Aucun projet futur annoncé.": "No upcoming project announced.",
    # research.html
    "Programmes de Recherche": "Research Programs",
    "Nos projets de recherche": "Our research projects",
    "Explorations et travaux de R&D en cours chez Minimum Tech": "Ongoing explorations and R&D work at Minimum Tech",
    "Contexte": "Context",
    "Contexte de la recherche": "Research context",
    "But de la recherche": "Research goal",
    "Où en sommes-nous ?": "Where are we now?",
    "Résultats": "Results",
    "Résultats obtenus": "Results achieved",
    "Améliorations": "Improvements",
    "Pistes d'amélioration": "Areas for improvement",
    "Voir plus": "See more",
    "Retour à l'accueil": "Back to home",
    "Aucun projet de recherche publié pour le moment.": "No research project published yet.",
    # blog.html
    "Blog & Recherches": "Blog & Research",
    "Explorez nos articles sur les dernières innovations technologiques": "Explore our articles on the latest technological innovations",
    "Lire l'article": "Read article",
    "Source externe": "External source",
    "Aucun article pour le moment.": "No article yet.",
    # blog_post.html
    "Voir la source externe": "View external source",
    "Retour au blog": "Back to blog",
    # contact.html
    "Nous sommes à votre écoute": "We are listening",
    "Envoyez-nous un message": "Send us a message",
    "Nom complet": "Full name",
    "Votre nom": "Your name",
    "Sujet": "Subject",
    "Sujet du message": "Message subject",
    "Message": "Message",
    "Votre message...": "Your message...",
    "Envoyer": "Send",
    "Nos coordonnées": "Our contact details",
    "Téléphone": "Phone",
    "Adresse": "Address",
    # views.py messages
    "Votre message a été envoyé avec succès !": "Your message has been sent successfully!",
    "Veuillez remplir tous les champs obligatoires.": "Please fill in all required fields.",
}

trans_re = re.compile(r"""\{%\s*trans\s+(['"])(.+?)\1\s*%\}""")
entries = {}
for tpl in list(TEMPLATES.rglob('*.html')) + [BASE / 'core' / 'views.py']:
    text = tpl.read_text(encoding='utf-8')
    for m in trans_re.finditer(text):
        msgid = m.group(2)
        # Unescape &amp; for the po file consistency? Keep as-is to match template output.
        entries[msgid] = EN.get(msgid, '')
    # views.py uses _( '...' )
    for m in re.finditer(r"_\(\s*['\"](.+?)['\"]\s*\)", text):
        msgid = m.group(1)
        entries[msgid] = EN.get(msgid, msgid)

missing = [k for k, v in entries.items() if not v and k not in EN]
if missing:
    print('MISSING translations:')
    for k in missing:
        print(' -', k)

LOCALE_EN.mkdir(parents=True, exist_ok=True)
po = polib.POFile()
po.metadata = {
    'Project-Id-Version': 'Minimum Tech 1.0',
    'Language': 'en',
    'MIME-Version': '1.0',
    'Content-Type': 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding': '8bit',
}
for msgid, msgstr in sorted(entries.items()):
    if msgstr:
        po.append(polib.POEntry(msgid=msgid, msgstr=msgstr))
po_path = LOCALE_EN / 'django.po'
po.save(str(po_path))
mo_path = LOCALE_EN / 'django.mo'
po.save_as_mofile(str(mo_path))
print(f'Wrote {len(po)} entries -> {po_path}')
print(f'Compiled {mo_path}')

# French catalog: identity mapping (msgid is already French) so Django
# does not fall back to the English catalog when lang=fr.
LOCALE_FR = BASE / 'locale' / 'fr' / 'LC_MESSAGES'
LOCALE_FR.mkdir(parents=True, exist_ok=True)
po_fr = polib.POFile()
po_fr.metadata = dict(po.metadata, Language='fr')
for entry in po:
    po_fr.append(polib.POEntry(msgid=entry.msgid, msgstr=entry.msgid))
fr_po = LOCALE_FR / 'django.po'
po_fr.save(str(fr_po))
po_fr.save_as_mofile(str(LOCALE_FR / 'django.mo'))
print(f'Wrote {len(po_fr)} identity entries -> {fr_po}')
