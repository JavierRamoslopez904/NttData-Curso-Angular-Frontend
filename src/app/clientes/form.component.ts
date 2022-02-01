import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  // Creación de un objeto de la clase Cliente
  public cliente : Cliente = new Cliente();

  // Creación de un objeto de la clase Region
  regiones : Region[];

  // Creación de un objeto del servicio, para que podamos acceder a los métodos
  //, otro objeto de la clase Router para navegar entre distintos componentes
  // gracias al método .navigate, y por último un objeto de la clase Activated
  // Routed para tomar como parámetro ciertos valores, gracias al método
  // params
  constructor(private clienteService : ClienteService, private router : Router,private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente()

    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones)
  }

  /**
   * Método encargado de mostrar los datos del cliente cuando lo queramos modificar
   */
  public cargarCliente() : void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getClientee(id).subscribe(
          cliente => this.cliente = cliente
        )
      }
    }
    )
  }

  /**
   * Método encargado de crear un nuevo cliente
   */
  public create(): void{
    this.clienteService.create(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes'])
        swal.fire('Nuevo cliente',`Cliente ${json.cliente.nombre}`,'success')
      }
    )
  }

  /**
   * Método encargado de actualizar un cliente
   */
  public update() : void{
    this.clienteService.update(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes'])
        swal.fire('Cliente actualizado', `Cliente ${json.cliente.nombre}`,`success`)
      }
    )
  }

  /**
   * Método para comprar regiones
   * @param o1
   * @param o2
   * @returns
   */
  public compararRegion(o1: Region, o2: Region){

  if(o1 === undefined && o2 === undefined){
    return true;
  }

    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }
}
