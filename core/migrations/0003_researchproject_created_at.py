from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_category_alter_project_category_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='researchproject',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterModelOptions(
            name='researchproject',
            options={'ordering': ['-created_at'], 'verbose_name': 'Projet de Recherche', 'verbose_name_plural': 'Projets de Recherche'},
        ),
    ]
