import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  proyecto = {
    nombre: 'Salud Cauca',
    descripcion: 'Cuidamos de ti con ciencia y humanidad.',
    anio: new Date().getFullYear()
  };
  
  autor = {
    universidad: 'Universidad del Cauca'
  };
}
