from django.db import models


class Service(models.Model):
    CATEGORY_CHOICES = [
        ('data', 'Data & Analyse'),
        ('formation', 'Formation'),
        ('web', 'Développement Web'),
        ('recherche', 'Recherche'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='data')
    icon = models.CharField(max_length=50, default='ri-briefcase-line')
    link = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    display_order = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return self.title


class Project(models.Model):
    CATEGORY_CHOICES = [
        ('realisation', 'Réalisation'),
        ('partenariat', 'Partenariat'),
        ('collaboration', 'Collaboration'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='realisation')
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    tech_stack = models.CharField(max_length=500, blank=True, null=True)
    display_order = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return self.title


class FutureProject(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='future_projects/', blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    expected_date = models.CharField(max_length=100, blank=True, null=True)
    display_order = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return self.title


class ResearchProject(models.Model):
    title = models.CharField(max_length=200, default='Recherche sur les Robots Humanoïdes')
    subtitle = models.CharField(max_length=300, blank=True, null=True)
    context = models.TextField(help_text='Contexte de la recherche')
    goal = models.TextField(help_text='Objectif / But de la recherche')
    current_state = models.TextField(help_text='État actuel du projet')
    results = models.TextField(blank=True, null=True, help_text='Résultats obtenus')
    improvements = models.TextField(blank=True, null=True, help_text='Améliorations à apporter')
    image = models.ImageField(upload_to='research/', blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Projet de Recherche'
        verbose_name_plural = 'Projets de Recherche'

    def __str__(self):
        return self.title


class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    excerpt = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='blog/', blank=True, null=True)
    tags = models.CharField(max_length=300, blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    published = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Hero(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    cta_text = models.CharField(max_length=100, default='Découvrir')
    cta_link = models.CharField(max_length=200, default='/services')
    background_image = models.ImageField(upload_to='hero/', blank=True, null=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class CompanyInfo(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.key


class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=300, blank=True, null=True)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject or 'Sans sujet'}"
