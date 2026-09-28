import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicaService } from '../../services/clinica.service';

@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicos.html',
  styleUrl: './medicos.css'
})
export class Medicos {
  clinicaService = inject(ClinicaService);

  especialidades = ['Todas', 'Terapia neural', 'Quiropraxia', 'Fisioterapia', 'Nutrición y Dietética Terapéutica', 'Medicina interna'];
  especialidadSeleccionada = signal('Todas');

  descripcionesEspecialidad: Record<string, string> = {
    "Terapia neural": "La Terapia Neural regula el sistema nervioso mediante tratamientos específicos para mejorar tu bienestar y calidad de vida.",
    "Quiropraxia": "La Quiropraxia se enfoca en el cuidado y la alineación de la columna para mejorar la movilidad y reducir el dolor.",
    "Fisioterapia": "La Fisioterapia ayuda a recuperar movilidad, fuerza y autonomía con ejercicios y tratamientos personalizados.",
    "Nutrición y Dietética Terapéutica": "La nutrición y dietética acompaña tu recuperación con hábitos alimenticios y planes personalizados.",
    "Medicina interna": "La Medicina interna ofrece evaluación integral para apoyar la prevención, el diagnóstico y el tratamiento.",
    "Todas": "Atención integral con profesionales que diseñan un plan para cada persona."
  };

  descripcionActual = computed(() => this.descripcionesEspecialidad[this.especialidadSeleccionada()] || this.descripcionesEspecialidad['Todas']);

  medicosFiltrados = computed(() => {
    const medicos = this.clinicaService.medicos();
    const esp = this.especialidadSeleccionada();
    if (esp === 'Todas') return medicos;
    return medicos.filter(m => m.especialidad === esp);
  });

  cambiarEspecialidad(especialidad: string) {
    this.especialidadSeleccionada.set(especialidad);
  }

  agendarConMedico(idMedico: number) {
    this.clinicaService.seleccionarMedico(idMedico);
    document.getElementById('registro')?.scrollIntoView({ behavior: 'smooth' });
  }

  imagenMedico(id: number): string {
    const imagenes = [
      'img/doctor-juan.jpg',
      'img/doctora-catalina.jpg',
      'img/doctor-andres.jpg'
    ];
    return imagenes[(id - 1) % imagenes.length];
  }
}
