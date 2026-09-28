import { Injectable, signal } from '@angular/core';
import { Medico, Paciente, Cita } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {
  // Signals para estado reactivo
  medicos = signal<Medico[]>([]);
  pacientes = signal<Paciente[]>([]);
  citas = signal<Cita[]>([]);
  medicoSeleccionado = signal('');

  constructor() {
    this.inicializarMedicosPorDefecto();
  }

  // ==== MÉDICOS ====
  inicializarMedicosPorDefecto() {
    if (this.medicos().length > 0) return;

    const iniciales: Omit<Medico, 'id'>[] = [
      {
        nombres: 'Juan',
        apellidos: 'Pérez',
        especialidad: 'Fisioterapia',
        hora_inicio_atencion: '08:00',
        hora_fin_atencion: '12:00',
        anios_exp: '10',
        bio: 'Especialista en fisioterapia deportiva y recuperación funcional.'
      },
      {
        nombres: 'Catalina',
        apellidos: 'Sánchez',
        especialidad: 'Quiropraxia',
        hora_inicio_atencion: '09:00',
        hora_fin_atencion: '13:00',
        anios_exp: '8',
        bio: 'Especialista en diagnóstico y tratamiento de dolor lumbar y movilidad.'
      },
      {
        nombres: 'Andrés',
        apellidos: 'Cardozo',
        especialidad: 'Nutrición y Dietética Terapéutica',
        hora_inicio_atencion: '10:00',
        hora_fin_atencion: '14:00',
        anios_exp: '6',
        bio: 'Especialista en planes nutricionales y hábitos saludables para la recuperación.'
      }
    ];

    iniciales.forEach(m => this.registrarMedico(m));
  }

  registrarMedico(medico: Omit<Medico, 'id'>) {
    const nuevoId = this.siguienteId(this.medicos());
    const nuevoMedico = { id: nuevoId, ...medico };
    this.medicos.update(m => [...m, nuevoMedico]);
    return nuevoMedico;
  }

  seleccionarMedico(id: number) {
    this.medicoSeleccionado.set(String(id));
  }

  // ==== PACIENTES ====
  registrarPaciente(nombres: string, apellidos: string) {
    const nuevoId = this.siguienteId(this.pacientes());
    const nuevoPaciente: Paciente = { id: nuevoId, nombres, apellidos };
    this.pacientes.update(p => [...p, nuevoPaciente]);
    return nuevoPaciente;
  }

  // ==== CITAS ====
  registrarCita(idMedico: number, idPaciente: number, fecha: string, horaInicio: string, horaFin: string) {
    // Validaciones
    const citasMedico = this.citas().filter(c => c.idMedico === idMedico && c.fecha === fecha);
    
    // Convertir horas a minutos para facilitar comparación
    const getMinutos = (hora: string) => {
      const [h, m] = hora.split(':').map(Number);
      return h * 60 + m;
    };

    const inicioNuevo = getMinutos(horaInicio);
    const finNuevo = getMinutos(horaFin);

    // Validar cruce
    for (const cita of citasMedico) {
      const inicioExistente = getMinutos(cita.horaInicio);
      const finExistente = getMinutos(cita.horaFin);

      if ((inicioNuevo >= inicioExistente && inicioNuevo < finExistente) ||
          (finNuevo > inicioExistente && finNuevo <= finExistente) ||
          (inicioNuevo <= inicioExistente && finNuevo >= finExistente)) {
        throw new Error("El médico ya tiene una cita en ese horario");
      }
    }

    const nuevoId = this.siguienteId(this.citas());
    const nuevaCita: Cita = { id: nuevoId, idMedico, idPaciente, fecha, horaInicio, horaFin };
    this.citas.update(c => [...c, nuevaCita]);
    return nuevaCita;
  }

  // ==== UTILIDADES ====
  private siguienteId(coleccion: any[]): number {
    if (!coleccion || coleccion.length === 0) return 1;
    return Math.max(...coleccion.map(item => item.id)) + 1;
  }
}
