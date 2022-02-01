import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  // Creación de una variable de la clase Cliente
  clientes : Cliente[];
  paginador : any;
  clienteSeleccionado : Cliente;

  // En su constructor, tenemos que inicializar el servicio ya que es el encargado
  // de suministrarnos los métodos necesarios
  constructor(private clienteService : ClienteService, private activatedRoute : ActivatedRoute, private modalService : ModalService) { }

  /**
   * El método onInit va a ser el primero que se va a cargar cuando la aplicación
   * se lanze, por lo que vamos a mostrar con ayuda del operador .tap todos
   * los registros
   */
  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe( params => {
    // Aquí vamos a tener dos maneras de mostrar la información, la primera manera
    // con el método subscribe, que se va a encargar de mostrar los datos,
    // método muy importante

    //this.clienteService.getCliente(page).subscribe(clientes => this.clientes = clientes)

      let page : number = +params.get('page');

      if(!page){
        page = 0;
      }

    // Y la siguiente manera sería la siguiente :
    this.clienteService.getCliente(page).pipe(
      tap(response => {
        (response.content as Cliente[])
      })
    ).subscribe(response => {
      this.clientes = response.content as Cliente[];
      this.paginador = response;
    })
    });

    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if(cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    });

  }

  /**
   * Método encargado de eliminar un cliente
   * @param cliente
   */
  public delete(cliente : Cliente) : void{
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes =this.clientes.filter(cli => cli !== cliente)
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          }
        )
      }
    })
  }

  abrirModal(cliente : Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
