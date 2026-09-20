from django import template
register = template.Library()

@register.filter
def split(value, arg):
    return [x.strip() for x in value.split(arg) if x.strip()]
