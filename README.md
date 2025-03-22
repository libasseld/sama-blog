# Spécifications du Backend (localhost:8000)

## API d'Authentification

- **POST /api/auth/signup** : Inscription d'un nouvel utilisateur
  - Payload:
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string",
      "password_confirmation": "string"
    }
    ```
  - Response (201):
    ```json
    {
      "message": "Inscription réussie",
      "user": {
        "id": "integer",
        "name": "string",
        "email": "string"
      }
    }
    ```

- **POST /api/auth/login** : Connexion d'un utilisateur
  - Payload:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - Response (200):
    ```json
    {
      "message": "Connexion réussie",
      "user": {
        "id": "integer",
        "name": "string",
        "email": "string"
      },
      "token": "string"
    }
    ```

## API des Articles (Posts)

### Endpoints publics
- **GET /api/posts** : Récupération de tous les articles
  - Response (200): Liste des articles avec leurs auteurs
    ```json
    [
      {
        "id": "integer",
        "user_id": "integer",
        "title": "string",
        "content": "string",
        "image_url": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp",
        "author": {
          "id": "integer",
          "name": "string"
        }
      }
    ]
    ```

- **GET /api/posts/{id}** : Récupération d'un article spécifique
  - Response (200): Détails d'un article avec son auteur
    ```json
    {
      "id": "integer",
      "user_id": "integer",
      "title": "string",
      "content": "string",
      "image_url": "string", (optionel)
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "author": {
        "id": "integer",
        "name": "string"
      }
    }
    ```

- **POST /api/posts/{post_id}/comments** : Ajout d'un commentaire à un article
  - Payload:
    ```json
    {
      "name": "string",
      "content": "string"
    }
    ```
  - Response (201):
    ```json
    {
      "message": "Commentaire créé avec succès",
      "comment": {
        "id": "integer",
        "name": "string",
        "post_id": "integer",
        "content": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    }
    ```

- **GET /api/posts/{post_id}/comments** : Récupération des commentaires d'un article
  - Response (200): Liste des commentaires
    ```json
    [
      {
        "id": "integer",
        "name": "string",
        "post_id": "integer",
        "content": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    ]
    ```

### Endpoints protégés (authentification requise)
- **POST /api/posts** : Création d'un nouvel article
  - Payload:
    ```json
    {
      "title": "string",
      "content": "string",
      "image": "file (optionnel)"
    }
    ```
  - Response (201):
    ```json
    {
      "message": "Post créé avec succès",
      "post": {
        "id": "integer",
        "user_id": "integer",
        "title": "string",
        "content": "string",
        "image_url": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    }
    ```

- **PUT /api/posts/{post_id}** : Modification d'un article
  - Payload:
    ```json
    {
      "title": "string",
      "content": "string",
      "image": "file (optionnel)"
    }
    ```
  - Response (200):
    ```json
    {
      "message": "Article mis à jour avec succès",
      "post": {
        "id": "integer",
        "user_id": "integer",
        "title": "string",
        "content": "string",
        "image_url": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    }
    ```

- **DELETE /api/posts/{post_id}** : Suppression d'un article
  - Response (200):
    ```json
    {
      "message": "Post supprimé avec succès"
    }
    ```

## Structure des données

### Article (Post)
