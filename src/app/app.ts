import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Header } from './components/header/header';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Inicio } from './components/inicio/inicio';
import { Medicos } from './components/medicos/medicos';
import { Registro } from './components/registro/registro';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Header, Navbar, Footer, Inicio, Medicos, Registro],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // El estado principal de la aplicación está descentralizado en los componentes.
}
