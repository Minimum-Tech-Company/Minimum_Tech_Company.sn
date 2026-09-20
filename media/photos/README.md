# Dossier Photos

Placez vos images ici pour les utiliser sur le site.

## Images Hero (banière d'accueil)

- `hero-bg.jpg` — Image principale de la banière (1920x1080 recommandé)
- `hero-robotics.jpg` — Image robotique/IA
- `hero-data.jpg` — Image data/analyse

## Utilisation

Pour changer l'image de la banière d'accueil, modifiez le fichier :
`templates/core/index.html` → ligne avec `hero-bg.jpg`

```html
style="background: url('/media/photos/VALEUR.jpg') center/cover no-repeat;"
```

## Recommandations

- **Format**: JPG ou WebP
- **Taille recommandée**: 1920x1080px minimum
- **Poids max**: 500KB pour de bonnes performances
- **Style**: Sombre/foncé pour s'intégrer au design glassmorphism
