import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Article } from 'src/models/article';

@Component({
    selector: 'app-page-accueil',
    templateUrl: './page-accueil.component.html',
    styleUrls: ['./page-accueil.component.scss']
})
export class PageAccueilComponent {

    public nomApplication: string = "DEMO";

    public listeArticle: Article[] = []

    constructor(
        private http: HttpClient,
        private snackBar: MatSnackBar,
        private dialog: MatDialog) { }

    ngOnInit() {
        this.refresh()
    }

    refresh() {
        this.http
            .get("http://localhost:8080/liste-article")
            .subscribe(listeArticle => this.listeArticle = listeArticle as Article[])
        // .subscribe((listeArticle :any) => this.listeArticle = listeArticle)
    }

    onClickDeleteArticle(idArticle: number | undefined): void {
        if (idArticle != undefined) {
            const dialogReponse = this.dialog.open(DialogSupprimerArticle)
            dialogReponse.afterClosed().subscribe(
                reponseSuppression => {
                    if (reponseSuppression) {
                        this.http.delete("http://localhost:8080/article/" + idArticle).subscribe({
                            next: (article: any) => {
                                this.snackBar.open('L\'article "' + article.titre + '" a bien été supprimé', "OK", { duration: 5000 })
                                this.refresh()
                            },
                            error: resultat => {
                                this.snackBar.open("Une erreur est survenue", "OK", { duration: 5000 })
                                this.refresh()
                            }
                        })
                    }
                }
            )
        }
    }
}

@Component({
    selector: "dialog-supprimer-article",
    templateUrl: "../dialog-confirm-delete-article.html"
})
export class DialogSupprimerArticle {
    constructor(public dialogRef: MatDialogRef<DialogSupprimerArticle>) {

    }
}