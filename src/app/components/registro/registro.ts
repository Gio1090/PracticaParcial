import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { signal } from '@angular/core';
import { ClinicaService } from '../../services/clinica.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  clinicaService = inject(ClinicaService);
  mensaje = signal('');
  mensajeEsError = signal(false);

  private temporizadorMensaje?: number;

  pacienteData = {
    nombres: '',
    apellidos: '',
    aceptaTerminos: false
  };

  citaData = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    idMedico: '',
    idPaciente: ''
  };

  mostrarMensaje(mensaje: string, error = false) {
    if (this.temporizadorMensaje) {
      window.clearTimeout(this.temporizadorMensaje);
      this.temporizadorMensaje = undefined;
    }

    this.mensaje.set(mensaje);
    this.mensajeEsError.set(error);

    if (!error) {
      this.temporizadorMensaje = window.setTimeout(() => {
        this.mensaje.set('');
        this.temporizadorMensaje = undefined;
      }, 5000);
    }
  }

  cerrarMensaje() {
    if (this.temporizadorMensaje) {
      window.clearTimeout(this.temporizadorMensaje);
      this.temporizadorMensaje = undefined;
    }
    this.mensaje.set('');
  }

  registrarPaciente(formulario: NgForm) {
    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      this.mostrarMensaje('Revisa los campos y completa lo que falta para registrarte.', true);
      return;
    }

    try {
      this.clinicaService.registrarPaciente(this.pacienteData.nombres.trim(), this.pacienteData.apellidos.trim());
      this.mostrarMensaje('¡Paciente registrado! Ya puedes agendar tu cita.');
      this.pacienteData = { nombres: '', apellidos: '', aceptaTerminos: false };
    } catch (e: any) {
      this.mostrarMensaje(e.message || 'No pudimos registrar al paciente. Revisa los datos.', true);
    }
  }

  agendarCita(formulario: NgForm) {
    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      this.mostrarMensaje('Completa los datos de la cita y lo dejamos listo.', true);
      return;
    }

    if (this.citaData.horaFin <= this.citaData.horaInicio) {
      this.mostrarMensaje('La hora de fin tiene que ser después de la hora de inicio.', true);
      return;
    }

    try {
      this.clinicaService.registrarCita(
        Number(this.clinicaService.medicoSeleccionado()),
        Number(this.citaData.idPaciente),
        this.citaData.fecha,
        this.citaData.horaInicio,
        this.citaData.horaFin
      );
      this.mostrarMensaje('¡Cita agendada! Te esperamos en la clínica.');
      this.citaData = { fecha: '', horaInicio: '', horaFin: '', idMedico: '', idPaciente: '' };
      this.clinicaService.medicoSeleccionado.set('');
    } catch (e: any) {
      this.mostrarMensaje(e.message || 'No pudimos agendar la cita. Prueba con otro horario.', true);
    }
  }
}
