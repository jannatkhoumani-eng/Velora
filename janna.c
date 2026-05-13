#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define FICHIER_RESERVATIONS "reservations.txt"
typedef struct {
    int id;
    char nom[50], prenom[50], tel[15], date[15], heure[10];
    int numTable, nbPers;
    int active;
} Reservation;
// ================== FONCTION LETTRES ==================bx utilisateur idkhl horof mxi ar9m

int estLettre(char s[]) {
    int i=0;
    for (i = 0; s[i] != '\0'; i++) {
        if (!((s[i] >= 'A' && s[i] <= 'Z') || (s[i] >= 'a' && s[i] <= 'z'))) {
            return 0;
        }
    }
    return 1;
}void chargerReservations(Reservation tab[], int *nbResa) {
    FILE *f = fopen(FICHIER_RESERVATIONS, "r");
    if (f == NULL) {
        *nbResa = 0;
        return;
    }*nbResa = 0;
    while (*nbResa < 100 &&
           fscanf(f, "%d %49s %49s %14s %14s %9s %d %d",
                  &tab[*nbResa].id,
                  tab[*nbResa].nom,
                  tab[*nbResa].prenom,
                  tab[*nbResa].tel,
                  tab[*nbResa].date,
                  tab[*nbResa].heure,
                  &tab[*nbResa].numTable,
                  &tab[*nbResa].nbPers) == 8) {
        (*nbResa)++;
    }

    fclose(f);
}

void sauvegarderReservations(Reservation tab[], int nbResa) {
    FILE *f = fopen(FICHIER_RESERVATIONS, "w");
    int i;

    if (f == NULL) {
        printf("Erreur: impossible d'ouvrir le fichier de sauvegarde.\n");
        return;
    }for (i = 0; i < nbResa; i++) {
        fprintf(f, "%d %s %s %s %s %s %d %d\n",
                tab[i].id,
                tab[i].nom,
                tab[i].prenom,
                tab[i].tel,
                tab[i].date,
                tab[i].heure,
                tab[i].numTable,
                tab[i].nbPers);
    }

    fclose(f);
}

int prochainId(Reservation tab[], int nbResa) {
    int i, max = 99;
    for (i = 0; i < nbResa; i++) {
        if (tab[i].id > max) {
            max = tab[i].id;
        }
    }
    return max + 1;
}

int main() {
    Reservation tab[100];
    int nbResa = 0, choix, i, j, idRech, trouve, h, m;
    int capacites[10] = {2, 2, 2, 4, 4, 4, 6, 6, 6, 10};
    int id_auto = 100;
    int t;
     chargerReservations(tab, &nbResa);
    id_auto = prochainId(tab, nbResa);
    do {
        printf("\n--- GESTION RESTAURANT ---\n");
        printf("1. Reserver\n2. Annuler\n3. Liste\n4. Tables Libres\n5. Rechercher\n6. Quitter\n");
        printf("Choix : ");
        scanf("%d", &choix);

        switch (choix) {

        // ================= RESERVER =================
        case 1: {
            if (nbResa >= 100) {
                printf("Maximum de reservations atteint (100)\n");
                break;
            }

            Reservation r;
        do {
             printf("Nom : ");
             scanf("%s", r.nom);
             if (!estLettre(r.nom)) {
               printf("Nom invalide (lettres seulement)\n");
    }
} while (!estLettre(r.nom));

        do {
           printf("Prenom : ");
           scanf("%s", r.prenom);
            if (!estLettre(r.prenom)) {
          printf("Prenom invalide (lettres seulement)\n");
    }
} while (!estLettre(r.prenom));
           do{
            printf("Telephone : ");
            scanf("%s", r.tel);

            if (strlen(r.tel) != 10) {
                printf("Telephone invalide\n");
            }
            }while(strlen(r.tel)!=10);

            // ctrl heure+ouverture restaurant
             do {
                printf("Heure (HH:MM) : ");
                scanf("%9s", r.heure);
                if (sscanf(r.heure, "%d:%d", &h, &m) != 2) {
                    printf("Format invalide\n");
                } else if (h < 0 || h > 23 || m < 0 || m > 59) {
                    printf("Heure invalide\n");
                } else if (!((h >= 9 && h < 13) || (h >= 14 && h < 23))) {
                    printf("Restaurant ferme a cette heure, reessayez.\n");
                }
            } while (sscanf(r.heure, "%d:%d", &h, &m) != 2 ||h < 0 || h > 23 || m < 0 || m > 59 ||!((h >= 9 && h < 13) || (h >= 14 && h < 23)));
            printf("Date(jj/mm/aa) : ");
            scanf("%s", r.date);
            do{
            printf("Nombre de personnes : ");
            scanf("%d", &r.nbPers);

            // ctrl nb personnes
            if (r.nbPers <= 0) {
                printf("nombre invalide\n");

            }
            }while(r.nbPers<=0);

            // ctrl tabl+capacité
             do {
                 printf("Table (1-10) : ");
                   scanf("%d", &r.numTable);

    if (r.numTable < 1 || r.numTable > 10)
        printf("table invalide\n");

    else if (capacites[r.numTable - 1] < r.nbPers)
        printf("table trop petite, reessayer\n");

} while (r.numTable < 1 ||r.numTable > 10 ||capacites[r.numTable - 1] < r.nbPers);

            if (capacites[r.numTable - 1] < r.nbPers) {
                printf("table trop petite\n");
                break;
            }
//disponibilité table
            trouve = 0;
            for (i = 0; i < nbResa; i++) {
                if (tab[i].numTable == r.numTable &&
                    strcmp(tab[i].date, r.date) == 0 &&
                    strcmp(tab[i].heure, r.heure) == 0) {
                    trouve = 1;
                    break;
                }
            }

            if (trouve) {
                printf("Table deja occupee\n");
            } else {
                r.id = id_auto++;
                tab[nbResa++] = r;
                printf("Reservation ajoutee ID: %d\n", r.id);
            }

            break;
        }

        // ================= ANNULER =================
        case 2: {
            printf("Entrer ID : ");
            scanf("%d", &idRech);

            trouve = 0;

            for (i = 0; i < nbResa; i++) {
                if (tab[i].id == idRech) {
                    int confirm;
                    printf("Confirmer suppression (1=oui / 0=non): ");
                    scanf("%d", &confirm);

                    if (confirm == 1) {
                        for (j = i; j < nbResa - 1; j++) {
                            tab[j] = tab[j + 1];
                        }
                        nbResa--;
                        printf("Reservation annulee\n");
                    } else {
                        printf("Annulation annulee\n");
                    }

                    trouve = 1;
                    break;
                }
            }

            if (!trouve)
                printf("ID introuvable\n");

            break;
        }

        // ================= LISTE =================
        case 3:
            if (nbResa == 0) {
                printf("Aucune reservation\n");
            } else {
                for (i = 0; i < nbResa; i++) {
                    printf("ID:%d | %s %s | Tel:%s | Pers:%d | Table:%d | %s %s\n",
                           tab[i].id, tab[i].nom, tab[i].prenom,
                           tab[i].tel, tab[i].nbPers, tab[i].numTable,
                           tab[i].date, tab[i].heure);
                }
            }
            break;

        // ================= TABLES LIBRES =================
        case 4: {
            char date[15], heure[10];

            printf("Date : ");
            scanf("%s", date);

            printf("Heure : ");
            scanf("%s", heure);

            for (t = 1; t <= 10; t++) {
                trouve = 0;

                for (i = 0; i < nbResa; i++) {
                    if (tab[i].numTable == t &&
                        strcmp(tab[i].date, date) == 0 &&
                        strcmp(tab[i].heure, heure) == 0) {
                        trouve = 1;
                        break;
                    }
                }

                if (!trouve)
                    printf("Table %d libre (cap %d)\n", t, capacites[t - 1]);
            }
            break;
        }

        // ================= RECHERCHER =================
        case 5: {
            int opt;
            printf("Recherche par:\n");
            printf("1. ID\n2. Nom + Prenom\n3. Date + Heure\nChoix: ");
            scanf("%d", &opt);

            trouve = 0;

            // ====== 1. SEARCH BY ID ======
            if (opt == 1) {
                printf("Entrer ID: ");
                scanf("%d", &idRech);

                for (i = 0; i < nbResa; i++) {
                    if (tab[i].id == idRech) {
                        printf("Trouve: %s %s | Table %d | %s %s\n",
                               tab[i].nom, tab[i].prenom,
                               tab[i].numTable,
                               tab[i].date, tab[i].heure);
                        trouve = 1;
                    }
                }
            }

            // ====== 2. SEARCH BY NOM + PRENOM ======
            else if (opt == 2) {
                char nom[50], prenom[50];

                printf("Nom: ");
                scanf("%s", nom);

                printf("Prenom: ");
                scanf("%s", prenom);

                for (i = 0; i < nbResa; i++) {
                    if (strcmp(tab[i].nom, nom) == 0 &&
                        strcmp(tab[i].prenom, prenom) == 0) {

                        printf("Trouve: ID:%d | Table %d | %s %s\n",
                               tab[i].id,
                               tab[i].numTable,
                               tab[i].date, tab[i].heure);
                        trouve = 1;
                    }
                }
            }

            // ====== 3. SEARCH BY DATE + HEURE ======
            else if (opt == 3) {
                char date[15], heure[10];

                printf("Date: ");
                scanf("%s", date);

                printf("Heure: ");
                scanf("%s", heure);

                for (i = 0; i < nbResa; i++) {
                    if (strcmp(tab[i].date, date) == 0 &&
                        strcmp(tab[i].heure, heure) == 0) {

                        printf("Trouve: %s %s | Table %d | ID:%d\n",
                               tab[i].nom, tab[i].prenom,
                               tab[i].numTable,
                               tab[i].id);
                        trouve = 1;
                    }
                }
            }

            if (!trouve) {
                printf("Aucune reservation trouvee\n");
            }

            break;
        }

        case 6:
            printf("Bye\n");
            break;

        default:
            printf("choix invalide\n");
            }

    } while (choix != 6);

    return 0;
}
