import { Injectable } from '@angular/core';
import { User } from '@core/models/user';
import { Observable, Observer, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  init() {
    return new Observable((observer: Observer<IDBDatabase>) => {
      const request: IDBOpenDBRequest = indexedDB.open('registers', 1);

      request.onerror = (event) => {
        observer.error('Error al abrir la base de datos');
        observer.complete();
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        db.createObjectStore('users', { autoIncrement: true });
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        observer.next(db);
        observer.complete();
      };
    });
  }

  save(user: User) {
    return new Observable((observer: Observer<string>) => {
      this.init()
        .pipe(
          take(1)
        )
        .subscribe({
          next: (db: IDBDatabase) => {
            const transaction = db.transaction(['users'], 'readwrite');
            const objectStore = transaction.objectStore('users');
            const request = objectStore.add(user);

            request.onsuccess = () => {
              observer.next('Usuario guardado correctamente');
              observer.complete();
            };

            request.onerror = (event: any) => {
              observer.error('Error al guardar el usuario');
              observer.complete();
            };
          },
          error: (err: any) => {
            observer.error(err);
            observer.complete();
          }
        });
    });
  }

  delete(id: number) {
    return new Observable((observer: Observer<string>) => {
      this.init()
        .pipe(
          take(1)
        )
        .subscribe({
          next: (db: IDBDatabase) => {
            const transaction = db.transaction(['users'], 'readwrite');
            const objectStore = transaction.objectStore('users');

            const request = objectStore.delete(id);

            request.onsuccess = () => {
              observer.next('Usuario eliminado correctamente');
              observer.complete();
            };

            request.onerror = (event: any) => {
              observer.error('Error al eliminar el usuario');
              observer.complete();
            };
          },
          error: (err: any) => {
            observer.error(err);
            observer.complete();
          }
        });
    });
  }


  getUsers(): Observable<User[]> {
    return new Observable((observer: Observer<User[]>) => {
      this.init().pipe(
        take(1),
      ).subscribe({
        next: (db: IDBDatabase) => {
          const transaction = db.transaction(['users'], 'readonly');
          const objectStore = transaction.objectStore('users');

          const request = objectStore.getAll();

          request.onsuccess = () => {
            const products = request.result;
            observer.next(products);
            observer.complete();
          };

          request.onerror = (event: any) => {
            observer.error('Error al obtener los usuarios');
            observer.complete();
          };
        },
        error: (err: any) => {
          observer.error(err);
          observer.complete();
        }
      });
    });
  }

  getUserById(id: number): Observable<User | undefined> {
    return new Observable((observer: Observer<User | undefined>) => {
      this.init().pipe(
        take(1)
      ).subscribe({
        next: (db: IDBDatabase) => {
          const transaction = db.transaction(['users'], 'readonly');
          const objectStore = transaction.objectStore('users');

          const request = objectStore.get(id);

          request.onsuccess = () => {
            const user = request.result;
            observer.next(user);
            observer.complete();
          };

          request.onerror = (event: any) => {
            observer.error('Error al obtener el usuario');
            observer.complete();
          };
        },
        error: (err: any) => {
          observer.error(err);
          observer.complete();
        }
      });
    });
  }
}


