from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.cache import cache
from .models import Category, Service, Project, FutureProject, ResearchProject, BlogPost, Hero, CompanyInfo, ContactMessage

MAX_LOGIN_ATTEMPTS = 3
LOGIN_LOCKOUT_SECONDS = 20 * 60  # 20 minutes


def get_company_info():
    return {info.key: info.value for info in CompanyInfo.objects.all()}


# ============ PAGES PUBLIQUES ============

def index(request):
    context = {
        'hero': Hero.objects.filter(active=True).first(),
        'services': Service.objects.filter(active=True)[:6],
        'service_categories': list(Category.objects.filter(category_type='service', active=True).values('slug', 'name')),
        'projects': Project.objects.filter(active=True)[:3],
        'research': ResearchProject.objects.filter(active=True).first(),
        'company': get_company_info(),
    }
    return render(request, 'core/index.html', context)


def services_page(request):
    category = request.GET.get('cat', '')
    services = Service.objects.filter(active=True)
    if category:
        services = services.filter(category__slug=category)
    context = {
        'services': services,
        'categories': Category.objects.filter(category_type='service', active=True),
        'current_category': category,
        'company': get_company_info(),
    }
    return render(request, 'core/services.html', context)


def realisations_page(request):
    category = request.GET.get('cat', '')
    projects = Project.objects.filter(active=True)
    if category:
        projects = projects.filter(category__slug=category)
    context = {
        'projects': projects,
        'categories': Category.objects.filter(category_type='project', active=True),
        'current_category': category,
        'company': get_company_info(),
    }
    return render(request, 'core/realisations.html', context)


def futurs_projets_page(request):
    context = {
        'projects': FutureProject.objects.filter(active=True),
        'company': get_company_info(),
    }
    return render(request, 'core/futurs_projets.html', context)


def research_page(request):
    context = {
        'research_projects': ResearchProject.objects.filter(active=True).order_by('-created_at'),
        'company': get_company_info(),
    }
    return render(request, 'core/research.html', context)


def blog_page(request):
    context = {
        'posts': BlogPost.objects.filter(published=True),
        'company': get_company_info(),
    }
    return render(request, 'core/blog.html', context)


def blog_post_page(request, pk):
    post = get_object_or_404(BlogPost, pk=pk, published=True)
    context = {'post': post, 'company': get_company_info()}
    return render(request, 'core/blog_post.html', context)


def contact_page(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message_text = request.POST.get('message')
        if name and email and message_text:
            ContactMessage.objects.create(name=name, email=email, subject=subject, message=message_text)
            messages.success(request, 'Votre message a été envoyé avec succès !')
            return redirect('contact')
        else:
            messages.error(request, 'Veuillez remplir tous les champs obligatoires.')
    context = {'company': get_company_info()}
    return render(request, 'core/contact.html', context)


# ============ ADMIN ============

def admin_login(request):
    if request.user.is_authenticated:
        return redirect('admin_dashboard')

    ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', '')).split(',')[0].strip()
    cache_key = f'login_attempts_{ip}'
    attempts = cache.get(cache_key, 0)

    if attempts >= MAX_LOGIN_ATTEMPTS:
        messages.error(request, f'Trop de tentatives. Réessayez dans 20 minutes.')
        return render(request, 'core/admin/login.html')

    if request.method == 'POST':
        user = authenticate(request, username=request.POST.get('username'), password=request.POST.get('password'))
        if user:
            login(request, user)
            cache.delete(cache_key)
            return redirect('admin_dashboard')
        attempts += 1
        cache.set(cache_key, attempts, LOGIN_LOCKOUT_SECONDS)
        remaining = MAX_LOGIN_ATTEMPTS - attempts
        if remaining > 0:
            messages.error(request, f'Identifiants incorrects. Il vous reste {remaining} tentative(s).')
        else:
            messages.error(request, f'Trop de tentatives. Réessayez dans 20 minutes.')
    return render(request, 'core/admin/login.html')


def admin_logout(request):
    logout(request)
    return redirect('admin_login')


@login_required(login_url='/admin-panel/login/')
def admin_dashboard(request):
    ctx = {
        'services_count': Service.objects.count(),
        'projects_count': Project.objects.count(),
        'future_projects_count': FutureProject.objects.count(),
        'blog_count': BlogPost.objects.count(),
        'messages_count': ContactMessage.objects.count(),
        'unread_messages': ContactMessage.objects.filter(read=False).count(),
    }
    return render(request, 'core/admin/dashboard.html', ctx)


@login_required(login_url='/admin-panel/login/')
def admin_services(request):
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'create':
            Service.objects.create(
                title=request.POST['title'],
                description=request.POST['description'],
                category_id=request.POST.get('category') or None,
                icon=request.POST.get('icon', 'ri-briefcase-line'),
                link=request.POST.get('link', ''),
                image=request.FILES.get('image'),
                display_order=int(request.POST.get('display_order', 0)),
            )
            messages.success(request, 'Service créé.')
        elif action == 'update':
            s = Service.objects.get(id=request.POST['id'])
            s.title = request.POST['title']
            s.description = request.POST['description']
            s.category_id = request.POST.get('category') or None
            s.icon = request.POST.get('icon', 'ri-briefcase-line')
            s.link = request.POST.get('link', '')
            if request.FILES.get('image'):
                s.image = request.FILES['image']
            s.display_order = int(request.POST.get('display_order', 0))
            s.active = 'active' in request.POST
            s.save()
            messages.success(request, 'Service mis à jour.')
        elif action == 'delete':
            Service.objects.filter(id=request.POST['id']).delete()
            messages.success(request, 'Service supprimé.')
    ctx = {'services': Service.objects.all().order_by('display_order'), 'categories': Category.objects.filter(category_type='service', active=True)}
    return render(request, 'core/admin/services.html', ctx)


@login_required(login_url='/admin-panel/login/')
def admin_projects(request):
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'create':
            Project.objects.create(
                title=request.POST['title'],
                description=request.POST['description'],
                category_id=request.POST.get('category') or None,
                image=request.FILES.get('image'),
                link=request.POST.get('link', ''),
                tech_stack=request.POST.get('tech_stack', ''),
                display_order=int(request.POST.get('display_order', 0)),
            )
            messages.success(request, 'Projet créé.')
        elif action == 'update':
            p = Project.objects.get(id=request.POST['id'])
            p.title = request.POST['title']
            p.description = request.POST['description']
            p.category_id = request.POST.get('category') or None
            if request.FILES.get('image'):
                p.image = request.FILES['image']
            p.link = request.POST.get('link', '')
            p.tech_stack = request.POST.get('tech_stack', '')
            p.display_order = int(request.POST.get('display_order', 0))
            p.active = 'active' in request.POST
            p.save()
            messages.success(request, 'Projet mis à jour.')
        elif action == 'delete':
            Project.objects.filter(id=request.POST['id']).delete()
            messages.success(request, 'Projet supprimé.')
    ctx = {'projects': Project.objects.all().order_by('display_order'), 'categories': Category.objects.filter(category_type='project', active=True)}
    return render(request, 'core/admin/projects.html', ctx)


@login_required(login_url='/admin-panel/login/')
def admin_future_projects(request):
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'create':
            FutureProject.objects.create(
                title=request.POST['title'],
                description=request.POST['description'],
                image=request.FILES.get('image'),
                link=request.POST.get('link', ''),
                expected_date=request.POST.get('expected_date', ''),
                display_order=int(request.POST.get('display_order', 0)),
            )
        elif action == 'update':
            p = FutureProject.objects.get(id=request.POST['id'])
            p.title = request.POST['title']
            p.description = request.POST['description']
            if request.FILES.get('image'):
                p.image = request.FILES['image']
            p.link = request.POST.get('link', '')
            p.expected_date = request.POST.get('expected_date', '')
            p.display_order = int(request.POST.get('display_order', 0))
            p.active = 'active' in request.POST
            p.save()
        elif action == 'delete':
            FutureProject.objects.filter(id=request.POST['id']).delete()
    ctx = {'projects': FutureProject.objects.all().order_by('display_order')}
    return render(request, 'core/admin/future_projects.html', ctx)


@login_required(login_url='/admin-panel/login/')
def admin_research(request):
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'create':
            ResearchProject.objects.create(
                title=request.POST.get('title', 'Nouveau projet de recherche'),
                subtitle=request.POST.get('subtitle', ''),
                context=request.POST.get('context', ''),
                goal=request.POST.get('goal', ''),
                current_state=request.POST.get('current_state', ''),
                results=request.POST.get('results', ''),
                improvements=request.POST.get('improvements', ''),
                link=request.POST.get('link', ''),
                image=request.FILES.get('image'),
                active='active' in request.POST,
            )
            messages.success(request, 'Projet de recherche créé.')
        elif action == 'update':
            r = ResearchProject.objects.get(id=request.POST['id'])
            r.title = request.POST.get('title', r.title)
            r.subtitle = request.POST.get('subtitle', '')
            r.context = request.POST.get('context', '')
            r.goal = request.POST.get('goal', '')
            r.current_state = request.POST.get('current_state', '')
            r.results = request.POST.get('results', '')
            r.improvements = request.POST.get('improvements', '')
            r.link = request.POST.get('link', '')
            r.active = 'active' in request.POST
            if request.FILES.get('image'):
                r.image = request.FILES['image']
            r.save()
            messages.success(request, 'Projet de recherche mis à jour.')
        elif action == 'delete':
            ResearchProject.objects.filter(id=request.POST['id']).delete()
            messages.success(request, 'Projet de recherche supprimé.')
        return redirect('admin_research')
    ctx = {'research_list': ResearchProject.objects.all().order_by('-created_at')}
    return render(request, 'core/admin/research.html', ctx)


@login_required(login_url='/admin-panel/login/')
def admin_blog(request):
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'create':
            BlogPost.objects.create(
                title=request.POST['title'],
                content=request.POST['content'],
                excerpt=request.POST.get('excerpt', ''),
                image=request.FILES.get('image'),
                tags=request.POST.get('tags', ''),
                link=request.POST.get('link', ''),
                published='published' in request.POST,
                display_order=int(request.POST.get('display_order', 0)),
            )
        elif action == 'update':
            b = BlogPost.objects.get(id=request.POST['id'])
            b.title = request.POST['title']
            b.content = request.POST['content']
            if request.FILES.get('image'):
                b.image = request.FILES['image']
            b.excerpt = request.POST.get('excerpt', '')
            b.tags = request.POST.get('tags', '')
            b.link = request.POST.get('link', '')
            b.published = 'published' in request.POST
            b.display_order = int(request.POST.get('display_order', 0))
            b.save()
        elif action == 'delete':
            BlogPost.objects.filter(id=request.POST['id']).delete()
    ctx = {'posts': BlogPost.objects.all().order_by('-created_at')}
    return render(request, 'core/admin/blog.html', ctx)


@login_required(login_url='/admin-panel/login/')
def admin_hero(request):
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'create':
            if request.POST.get('active'):
                Hero.objects.update(active=False)
            Hero.objects.create(
                title=request.POST['title'],
                subtitle=request.POST.get('subtitle', ''),
                description=request.POST.get('description', ''),
                cta_text=request.POST.get('cta_text', 'Découvrir'),
                cta_link=request.POST.get('cta_link', '/services'),
                background_image=request.FILES.get('background_image'),
                active='active' in request.POST,
            )
        elif action == 'update':
            h = Hero.objects.get(id=request.POST['id'])
            if request.POST.get('active') and not h.active:
                Hero.objects.update(active=False)
            h.title = request.POST['title']
            h.subtitle = request.POST.get('subtitle', '')
            h.description = request.POST.get('description', '')
            h.cta_text = request.POST.get('cta_text', 'Découvrir')
            h.cta_link = request.POST.get('cta_link', '/services')
            if request.FILES.get('background_image'):
                h.background_image = request.FILES['background_image']
            h.active = 'active' in request.POST
            h.save()
        elif action == 'delete':
            Hero.objects.filter(id=request.POST['id']).delete()
    ctx = {'heroes': Hero.objects.all()}
    return render(request, 'core/admin/hero.html', ctx)


@login_required(login_url='/admin-panel/login/')
def admin_company(request):
    if request.method == 'POST':
        for key, value in request.POST.items():
            if key != 'csrfmiddlewaretoken':
                CompanyInfo.objects.update_or_create(key=key, defaults={'value': value})
        messages.success(request, 'Informations mises à jour.')
    ctx = {'infos': CompanyInfo.objects.all().order_by('key')}
    return render(request, 'core/admin/company.html', ctx)


@login_required(login_url='/admin-panel/login/')
def admin_messages(request):
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'mark_read':
            ContactMessage.objects.filter(id=request.POST['id']).update(read=True)
        elif action == 'delete':
            ContactMessage.objects.filter(id=request.POST['id']).delete()
    ctx = {'messages_list': ContactMessage.objects.all()}
    return render(request, 'core/admin/messages.html', ctx)


@login_required(login_url='/admin-panel/login/')
def admin_categories(request):
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'create':
            Category.objects.create(
                name=request.POST['name'],
                slug=request.POST['slug'],
                category_type=request.POST.get('category_type', 'service'),
                display_order=int(request.POST.get('display_order', 0)),
            )
            messages.success(request, 'Catégorie créée.')
        elif action == 'update':
            c = Category.objects.get(id=request.POST['id'])
            c.name = request.POST['name']
            c.slug = request.POST['slug']
            c.category_type = request.POST.get('category_type', 'service')
            c.display_order = int(request.POST.get('display_order', 0))
            c.active = 'active' in request.POST
            c.save()
            messages.success(request, 'Catégorie mise à jour.')
        elif action == 'delete':
            Category.objects.filter(id=request.POST['id']).delete()
            messages.success(request, 'Catégorie supprimée.')
    ctx = {'cats': Category.objects.all().order_by('category_type', 'display_order')}
    return render(request, 'core/admin/categories.html', ctx)


# ============ JSON API ============

def api_services(request):
    return JsonResponse(list(Service.objects.filter(active=True).values()), safe=False)

def api_projects(request):
    return JsonResponse(list(Project.objects.filter(active=True).values()), safe=False)

def api_future_projects(request):
    return JsonResponse(list(FutureProject.objects.filter(active=True).values()), safe=False)

def api_blog(request):
    return JsonResponse(list(BlogPost.objects.filter(published=True).values()), safe=False)

def api_company(request):
    return JsonResponse(get_company_info())
