import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  // Creación de una variable del tipo Cliente, anotada con @Input(anotación para recibir datos de otros componentes)
  @Input() cliente : Cliente;

  // Creación de una variable de tipo String
  titulo: string = "Detalle del cliente";

  // Creación de una variable de tipo File
  private fotoSeleccionada : File;

  // Creación de una variable de tipo number inicializada por defecto a 0
  progreso : number = 0;

  constructor(private clienteService : ClienteService, public modalService : ModalService) { }

  ngOnInit(): void {

  }

  /**
   * Método para seleccionar una foto
   * @param event
   */
  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      Swal.fire('Error seleccionar imagen : ', 'El archivo debe ser de tipo imagen', 'error');
    }
  }

  /**
   * Método para subir una foto
   */
  subirFoto(){

    if(!this.fotoSeleccionada){
      Swal.fire('Error : ', 'Debe seleccionar una foto', 'error');
    }else{
    this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
    .subscribe(event => {

      if(event.type === HttpEventType.UploadProgress){
        this.progreso = Math.round((event.loaded / event.total) * 100)
      }else if(event.type === HttpEventType.Response){
        let response : any = event.body;
        this.cliente = response.cliente as Cliente;

        this.modalService.notificarUpload.emit(this.cliente);

        Swal.fire('La foto se ha subido correctamente',response.mensaje,'success');
      }
    });
  }
  }

  /**
   * Método para cerrar el modal
   */
  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

}
