import django.db.models.deletion
from django.db import migrations, models

SERVICE_CATEGORIES = [
    ('data', 'Data & Analyse'),
    ('formation', 'Formation'),
    ('web', 'Développement Web'),
    ('recherche', 'Recherche'),
]

PROJECT_CATEGORIES = [
    ('realisation', 'Réalisation'),
    ('partenariat', 'Partenariat'),
    ('collaboration', 'Collaboration'),
]


def create_categories(apps, schema_editor):
    Category = apps.get_model('core', 'Category')
    for i, (slug, name) in enumerate(SERVICE_CATEGORIES):
        Category.objects.get_or_create(slug=slug, category_type='service', defaults={'name': name, 'display_order': i})
    for i, (slug, name) in enumerate(PROJECT_CATEGORIES):
        Category.objects.get_or_create(slug=slug, category_type='project', defaults={'name': name, 'display_order': i})


def convert_values(apps, schema_editor):
    """Replace slug strings with integer category IDs in-place (SQLite is dynamically typed)."""
    Category = apps.get_model('core', 'Category')
    cat_map = {}
    for c in Category.objects.all():
        cat_map[(c.slug, c.category_type)] = c.id

    schema_editor.execute("""
        UPDATE core_service SET category = (
            SELECT id FROM core_category WHERE slug = core_service.category AND category_type = 'service'
        ) WHERE category IN ('data','formation','web','recherche')
    """)
    schema_editor.execute("""
        UPDATE core_project SET category = (
            SELECT id FROM core_category WHERE slug = core_project.category AND category_type = 'project'
        ) WHERE category IN ('realisation','partenariat','collaboration')
    """)
    # Nullify unmatched values
    schema_editor.execute("""
        UPDATE core_service SET category = NULL WHERE category IS NOT NULL AND category NOT GLOB '[0-9]*'
    """)
    schema_editor.execute("""
        UPDATE core_project SET category = NULL WHERE category IS NOT NULL AND category NOT GLOB '[0-9]*'
    """)


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('slug', models.SlugField(max_length=100, unique=True)),
                ('category_type', models.CharField(choices=[('service', 'Service'), ('project', 'Réalisation')], default='service', max_length=20)),
                ('display_order', models.IntegerField(default=0)),
                ('active', models.BooleanField(default=True)),
            ],
            options={
                'ordering': ['display_order'],
                'unique_together': {('slug', 'category_type')},
            },
        ),
        migrations.RunPython(create_categories),
        migrations.RunPython(convert_values),
        migrations.AlterField(
            model_name='service',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='services', to='core.category'),
        ),
        migrations.AlterField(
            model_name='project',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='projects', to='core.category'),
        ),
    ]
