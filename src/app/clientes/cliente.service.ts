import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region';
import { map, Observable, throwError,tap } from 'rxjs';
import { of } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // Atributo privado encargado de guardar la URL del proyecto de Eclipse
  private urlEndPoint : string = 'http://localhost:8080/api/clientes';

  // Atributo privado de la clase HttpHeaders necesario para la creación
  // de un cliente
  private httpHeaders = new HttpHeaders({'Content-type' : 'application/json'})

  constructor(private http:HttpClient, private router : Router) { }

  /**
   * Método getCliente que va a retornar todos los clientes de la URL
   * @returns
   */
  getCliente(page : number) : Observable<any>{
    return this.http.get<Cliente[]>(this.urlEndPoint + '/page/' + page).pipe(
      map((response :any) => {
        (response.content as Cliente[]).map(cliente =>{
          cliente.nombre = cliente.nombre.toUpperCase();

          return cliente;
        });
        return response;
      }),
      tap((response : any) => {
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre)
        })
      }),
    );
  }

  /**
   * Método create que va a crear un cliente
   * @param cliente
   * @returns
   */
  create(cliente : Cliente) : Observable<any> {
    return this.http.post<any>(this.urlEndPoint,cliente,{headers : this.httpHeaders}).pipe(
      catchError( e=> {

        if(e.status == 400){
          return throwError(e)
        }

        Swal.fire('Error al crear', e.error.mensaje);
        return throwError(e);
      }
      )
    );
  }

  /**
   * Método getClientee(id) que va a mostrar los datos de un cliente a través
   * de su id
   * @param id
   * @returns
   */
  getClientee(id) : Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate['/clientes']
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  /**
   * Método para actualizar un cliente
   * @param cliente
   * @returns
   */
  update(cliente : Cliente) : Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers : this.httpHeaders}).pipe(
      catchError ( e => {

        if(e.status == 400){
          return throwError(e)
        }

        this.router.navigate['/clientes']
        Swal.fire('Error al actualizar', e.error.mensaje, 'error');
        return throwError(e);
      }
      )
    )
    }

  /**
   * Método para borrar un cliente
   * @param id
   * @returns
   */
  delete(id: number) : Observable<any>{
    return this.http.delete<any>(`${this.urlEndPoint}/${id}`,{headers : this.httpHeaders}).pipe(
      catchError ( e => {
        this.router.navigate['/clientes']
        Swal.fire('Error al actualizar', e.error.mensaje, 'error');
        return throwError(e);
      }
      )
    )
  }

  /**
   * Método para actualizar la foto del cliente, proporcionando el archivo
   * y el ID del cliente
   * @param archivo
   * @param id
   */
  subirFoto(archivo : File, id) : Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);

    const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`, formData, {
      reportProgress : true
    });

    return this.http.request(req);
  }

  /**
   * Método para mostrar todas las regiones
   * @returns
   */
  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }

}
