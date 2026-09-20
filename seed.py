import os
import sys
import django

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from core.models import Service, FutureProject, ResearchProject, Hero, CompanyInfo

# Create admin user
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@minimumtech.com', 'Admin@2024')
    print('Admin user created: admin / Admin@2024')

# Seed services
if Service.objects.count() == 0:
    Service.objects.create(
        title='Business Intelligence',
        description='Tableaux de bord et visualisation de données pour une prise de décision éclairée. Nous concevons des dashboards interactifs avec Power BI, Tableau et d\'autres outils BI pour transformer vos données en insights stratégiques.',
        category='data',
        icon='ri-bar-chart-grouped-line',
        display_order=1
    )
    Service.objects.create(
        title='Formation & Compétences',
        description='Formation de vos équipes sur les outils d\'analyse et de collecte de données : Power BI, SQL, Excel avancé, et bien plus. Programmes personnalisés adaptés à votre niveau et vos besoins métier.',
        category='formation',
        icon='ri-book-open-line',
        display_order=2
    )
    Service.objects.create(
        title='Création de Sites Web',
        description='Développement de sites web professionnels et d\'applications SaaS sur mesure. Sites vitrines, e-commerce, plateformes SaaS — nous créons votre présence numérique avec les technologies modernes.',
        category='web',
        icon="ri-code-s-slash-line",
        display_order=3
    )
    print('Services seeded')

# Seed future projects
if FutureProject.objects.count() == 0:
    FutureProject.objects.create(
        title='Recherche sur les Robots Humanoïdes',
        description='Exploration de nouvelles technologies pour le développement de robots humanoïdes intelligents.',
        expected_date='En cours — Phase exploratoire',
        display_order=1
    )
    print('Future projects seeded')

# Seed research project
if ResearchProject.objects.count() == 0:
    ResearchProject.objects.create(
        title='Recherche sur les Robots Humanoïdes',
        subtitle='Un programme de recherche dédié au développement de robots humanoïdes intelligents',
        context='Dans un monde en constante évolution technologique, les robots humanoïdes représentent une frontière passionnante. Minimum Tech s\'est lancé dans un programme de recherche exploratoire pour comprendre et développer les technologies clés qui permettront de créer des robots capables d\'interagir naturellement avec les humains.',
        goal='Développer des prototypes de robots humanoïdes capables de perception环境, de compréhension du langage naturel, et d\'interaction sociale fluide. Objectif à long terme : créer des robots utiles pour les services, la santé et l\'industrie.',
        current_state='Phase exploratoire et veille technologique. Étude des architectures existantes (Boston Dynamics, Tesla Optimus, Figure AI), analyse des composants clés (capteurs, actionneurs, modèles d\'IA) et définition des axes de R&D prioritaires.',
        results='Rapport d\'état de l\'art sur les technologies de robots humanoïdes. Identification des composants critiques et estimation des coûts de développement. Premier prototype conceptuel en cours de conception.',
        improvements='Intégration de modèles de langage avancés pour la compréhension contextuelle. Amélioration des systèmes de locomotion bipède. Développement de capteurs tactiles de nouvelle génération. Collaboration avec des laboratoires de recherche universitaires.'
    )
    print('Research project seeded')

# Seed company info
infos = [
    ('company_name', 'Minimum Tech'),
    ('company_tagline', 'Solutions technologiques innovantes'),
    ('company_description', 'Nous concevons des solutions numériques sur mesure pour propulser votre entreprise vers le succès.'),
    ('company_email', 'contact@minimumtech.com'),
    ('company_phone', '+243 000 000 000'),
    ('company_address', 'Kinshasa, RDC'),
    ('company_website', 'https://minimumtech.com'),
    ('about_text', 'Minimum Tech est une entreprise technologique dédiée à l\'innovation et à l\'excellence. Nous transformons vos idées en solutions numériques performantes.'),
    ('footer_text', '© 2025 Minimum Tech. Tous droits réservés.'),
]
for key, value in infos:
    CompanyInfo.objects.get_or_create(key=key, defaults={'value': value})

# Seed hero
if Hero.objects.count() == 0:
    Hero.objects.create(
        title='Transformez votre vision en',
        subtitle='réalité numérique',
        description='Nous concevons des solutions numériques sur mesure pour propulser votre entreprise vers le succès.',
        cta_text='Découvrir nos services',
        cta_link='/services/',
        active=True
    )
    print('Hero seeded')

print('Database seeded successfully!')
