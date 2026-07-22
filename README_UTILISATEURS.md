# Chartes_Douane_Occitanie - guide utilisateurs

Chartes_Douane_Occitanie est une application locale pour construire une charte des règles de bonne conduite et de courtoisie. Elle fonctionne hors ligne en ouvrant simplement `index.html` dans un navigateur récent.

Aucune donnée n'est envoyée sur Internet. Les informations restent sur le poste utilisateur.

## Ouvrir l'outil

1. Ouvrez le dossier du projet.
2. Double-cliquez sur `index.html`.
3. Utilisez une version récente de Chrome, Edge ou Firefox.

Si le navigateur bloque le chargement local des fichiers `data/`, les valeurs officielles, le schéma global et les ressources intégrées à l'application sont utilisés automatiquement.

Au premier lancement, si aucun brouillon local n'existe encore, l'application charge automatiquement `exemples/exemple_charte.json`. Cet exemple est au format actuel et peut être modifié directement.

## Fichiers utiles du projet

Le projet est autonome : il ne dépend d'aucun fichier placé en dehors du dossier `Chartes_Douane_Occitanie`.

Fichiers et dossiers à conserver :

- `index.html`, `styles.css`, `app.js`, `pdf-export.js` ;
- `data/` avec les valeurs, palettes, polices, icônes, logo Douanes et ressources intégrées ;
- `vendor/` avec `jspdf.umd.min.js`, `fflate.min.js` et leurs notices de licence ;
- `exemples/exemple_charte.json` ;
- `LICENCE.md` ;
- `README_UTILISATEURS.md`.

Le dossier `archives/` contient uniquement des anciens fichiers ou ressources non utilisés par l'application courante.

## Licence

Chartes_Douane_Occitanie est un outil interne DGDDI, destiné à un usage par les services des Douanes et Droits indirects, sauf décision de publication par l'administration compétente.

Les bibliothèques locales `jsPDF` et `fflate` sont distribuées sous licence MIT. Leurs notices complètes sont conservées dans `vendor/licenses/` et doivent rester dans le projet en cas de redistribution interne du dossier.

## Reprendre une charte existante

Le bouton `Importer une charte ZIP / JSON`, placé en haut de l'écran, permet de rouvrir un ZIP d'échange ou un fichier JSON exporté précédemment. Les anciennes structures JSON sont converties automatiquement lorsque c'est possible.

## Étape 1 - Mise en page du document

Choisissez la palette graphique et la police principale. Ces choix s'appliquent uniquement aux documents produits et à l'aperçu A4, pas au formulaire.

## Étape 2 - Informations du service

Renseignez le nom du service, la version de la charte, la date de validation, les textes d'introduction et d'engagement, puis ajoutez éventuellement un logo de service. Le logo Douanes est intégré automatiquement aux documents.

La version de la charte sert au nom des fichiers d'échange. Exemple : pour `BSI Millau` et `v2`, le ZIP sera nommé `bsi-millau-v2-projet-charte.zip`.

## Étape 3 - Choix des valeurs

Les neuf valeurs proviennent de `data/valeurs_charte_pdf_structure_codex.json` et du fichier de secours local `data/values-inline.js` : Solidarité, Responsabilité, Échanges, Équité, Reconnaissance, Bienveillance, Confiance, Respect et Convivialité.

Sélectionnez exactement trois valeurs avec les boutons `Ajouter` et `Retirer` ou par glisser-déposer. Les valeurs disponibles et retenues utilisent la même présentation compacte. Le lien de détail affiche la définition complète.

## Étape 4 - Valeurs

Chaque valeur retenue possède un bloc repliable. En mode replié, le bloc affiche son nom et sa définition courte. Ajoutez au moins une règle, un geste ou un engagement concret pour chaque valeur. Dans une zone d'items, la touche `Entrée` crée automatiquement une nouvelle ligne précédée d'une puce ; `Maj+Entrée` crée un simple retour à la ligne.

## Étape 5 - Engagements

Les trois cadres `En tant que collègue`, `En tant que professionnel` et `En tant qu'équipe` sont préremplis. Vous pouvez ajouter ou supprimer des lignes. Dans une zone d'engagement, la touche `Entrée` crée automatiquement une nouvelle ligne précédée d'une puce ; `Maj+Entrée` crée un simple retour à la ligne.

## Aperçu

La prévisualisation du formulaire reste volontairement en A4 pour garder une interface simple. Les boutons PDF produisent chacun leur mise en page dédiée :

- `PDF A4` : charte complète multipage ;
- `PDF A3` : poster paysage sur une page.

Dans le schéma global, les trois valeurs choisies sont colorées et les autres sont grisées. Les phrases synthétiques apparaissent seulement sous les valeurs retenues.

## Sauvegarder et exporter

- `Sauvegarder temporairement` conserve le brouillon dans le navigateur avec `localStorage`. Cette sauvegarde sert à reprendre le travail sur le même poste, mais ce n'est pas le fichier à partager.
- `Exporter le ZIP d'échange` crée un dossier compressé lisible contenant le JSON complet, les versions HTML A4/A3, un manifeste et un guide texte.
- `PDF A4` et `PDF A3` téléchargent le document demandé.

Pour collaborer, partagez le ZIP complet ou le fichier `*-echange.json` contenu dans le ZIP. Le destinataire peut utiliser `Importer une charte ZIP / JSON` pour reprendre la charte, modifier les contenus et exporter une nouvelle version.

Dans Chrome ou Edge, le navigateur peut proposer de choisir l'emplacement du ZIP. Dans Firefox, ou si le sélecteur de fichier n'est pas disponible, le ZIP est placé dans le dossier de téléchargements configuré par le navigateur.

## Dépannage

### Le schéma global n'apparaît pas

Rechargez la page avec `Ctrl+F5`. Le schéma est aussi intégré dans `data/values-schema-inline.js` afin d'éviter les blocages liés au mode `file://`.

### Les valeurs ne se chargent pas

Le navigateur peut bloquer certains fichiers JSON locaux. L'application utilise alors automatiquement le fichier de secours `data/values-inline.js`.

### Le PDF est vide ou incomplet

Vérifiez que le nom du service est renseigné, que trois valeurs sont sélectionnées et que chaque valeur contient au moins une ligne. Utilisez les boutons PDF dédiés plutôt que l'impression du navigateur.

### Le PDF affiche l'URL, la date ou des numéros de page

Les boutons PDF dédiés n'ajoutent pas ces éléments. Si vous utilisez l'impression de secours du navigateur, désactivez l'option `En-têtes et pieds de page`.

### Le logo de service n'apparaît pas

Réimportez le logo depuis le formulaire et utilisez de préférence un fichier PNG, JPG ou SVG de taille raisonnable.

### Les polices ne se chargent pas

Vérifiez que les ressources locales du dossier `data/fonts/` sont présentes. Les polices de secours du navigateur restent utilisables.

### Un ancien JSON s'importe mal

Réessayez avec le bouton `Importer une charte ZIP / JSON` en haut de page. Les champs obsolètes sont ignorés et les anciennes structures prises en charge sont migrées automatiquement.

## Checklist de test manuel

1. Ouvrir `index.html`.
2. Vérifier les neuf valeurs.
3. Choisir une palette et une police.
4. Sélectionner trois valeurs.
5. Vérifier que les valeurs disponibles et retenues sont compactes.
6. Ajouter au moins une ligne pour chaque valeur.
7. Ajouter des items de valeur avec la touche `Entrée` et vérifier les puces automatiques.
8. Ajouter des engagements avec la touche `Entrée` et vérifier les puces automatiques.
9. Vérifier que l'aperçu reste en A4.
10. Télécharger le PDF A4 et vérifier le schéma global.
11. Télécharger le PDF A3 et vérifier qu'il tient sur une page.
12. Vérifier que les valeurs non retenues ont la même taille de nom que les valeurs retenues.
13. Vérifier que les engagements A3 sont répartis sur deux colonnes dans chaque cadre.
14. Renseigner une version, sauvegarder temporairement puis exporter le ZIP d'échange.
15. Réimporter le JSON et vérifier la restauration des contenus et de la palette.
