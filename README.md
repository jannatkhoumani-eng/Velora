# Système de Gestion de Réservations de Restaurant

## Description
Ce projet est une application en ligne de commande (CLI) écrite en C permettant de gérer les réservations d'un restaurant. L'application permet d'ajouter, d'annuler, d'afficher, de rechercher des réservations et de vérifier la disponibilité des tables. Les données sont sauvegardées de manière persistante dans un fichier texte.

## Fonctionnalités
- **Réserver une table** : Permet de créer une nouvelle réservation en vérifiant la validité des informations (nom, prénom, numéro de téléphone, heure d'ouverture, capacité de la table).
- **Annuler une réservation** : Supprime une réservation existante en utilisant son identifiant (ID).
- **Lister les réservations** : Affiche toutes les réservations en cours.
- **Vérifier les tables libres** : Affiche les tables disponibles pour une date et une heure données.
- **Rechercher une réservation** : Permet de chercher des réservations par :
  - Identifiant (ID)
  - Nom et Prénom
  - Date et Heure

## Détails Techniques
- **Langage** : C
- **Stockage des données** : Les réservations sont sauvegardées et chargées depuis un fichier texte nommé `reservations.txt`.
- **Capacité** : Le système gère un maximum de 100 réservations simultanées et 10 tables avec des capacités variant de 2 à 10 personnes.
- **Contrôles de saisie** : L'application vérifie que le nom et prénom ne contiennent que des lettres, que le téléphone a 10 caractères, que l'heure respecte les horaires d'ouverture (09h-13h et 14h-23h) et que la capacité de la table correspond au nombre de personnes.

## Fichiers du Projet
- `janna.c` : Code source principal de l'application.
- `reservations.txt` : Fichier de sauvegarde des données (généré automatiquement).
- `mini prjt c.cbp` et `mini prjt c.layout` : Fichiers de projet Code::Blocks.

## Comment exécuter le projet
1. Compilez le fichier source `janna.c` avec un compilateur C (par exemple GCC) :
   ```bash
   gcc janna.c -o gestion_restaurant
   ```
2. Exécutez le programme compilé :
   ```bash
   ./gestion_restaurant
   ```
   *(Sur Windows, double-cliquez sur l'exécutable ou lancez `gestion_restaurant.exe` depuis le terminal)*
