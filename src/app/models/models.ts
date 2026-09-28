export interface Medico {
  id: number;
  nombres: string;
  apellidos: string;
  especialidad: string;
  hora_inicio_atencion: string;
  hora_fin_atencion: string;
  anios_exp: number | string;
  bio: string;
}

export interface Paciente {
  id: number;
  nombres: string;
  apellidos: string;
}

export interface Cita {
  id: number;
  idMedico: number;
  idPaciente: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}
