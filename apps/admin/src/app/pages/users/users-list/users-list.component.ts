import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService, User  } from '@anibal/users';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [
  ]
})
export class UsersListComponent implements OnInit, OnDestroy {

  users: User[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(private usersService: UsersService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private router: Router) { }

  ngOnInit(): void {
    this._getUsers();
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  deleteUser(userId: string) {
    this.confirmationService.confirm({
      message: 'Estas seguro qeu quieres eliminar a este usuario?',
      header: 'Eliminar usuario',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(userId).subscribe(
          () => {
            this._getUsers();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'El usuario ha sido eliminado!'
            });
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'El usuario no se pudo eliminar!'
            });
          }
        );
      }
    });
  }
  

  updateUser(userid: string) {
    this.router.navigateByUrl(`users/form/${userid}`);
  }
  

  private _getUsers() {
    this.usersService.getUsers()
    .pipe(takeUntil(this.endsubs$))
    .subscribe((users) => {
      this.users = users;
    });
  }

}
