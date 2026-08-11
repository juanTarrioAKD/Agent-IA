import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import Header from '../components/header';
import { CustomSelect } from '../components/custom_select';
import '../compCSS/HorariosPage.css';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const START_HOUR = 8;
const END_HOUR = 23; // último bloque termina a las 23:00
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
const STORAGE_KEY = 'horarios_activities_v1';

const ACTIVITY_TYPES = [
  { label: 'Cursada', color: '#4F46E5' },
  { label: 'Gimnasio', color: '#EF4444' },
  { label: 'Estudio', color: '#10B981' },
  { label: 'Trabajo', color: '#F59E0B' },
  { label: 'Otro', color: '#6B7280' },
];

const colorForType = (type) => ACTIVITY_TYPES.find((t) => t.label === type)?.color || '#6B7280';
const formatHour = (h) => `${String(h).padStart(2, '0')}:00`;
const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const loadActivities = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const emptyForm = (day = 0, startHour = START_HOUR) => ({
  id: null,
  title: '',
  type: ACTIVITY_TYPES[0].label,
  day,
  startHour,
  endHour: Math.min(startHour + 1, END_HOUR),
  notes: '',
});

const HorariosPage = () => {
  const [activities, setActivities] = useState(loadActivities);
  const [modalData, setModalData] = useState(null); // null = cerrado

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  const activitiesByDay = useMemo(() => {
    const map = {};
    DAYS.forEach((_, idx) => { map[idx] = []; });
    activities.forEach((a) => map[a.day]?.push(a));
    return map;
  }, [activities]);

  const openAddModal = (day, startHour) => {
    setModalData(emptyForm(day, startHour));
  };

  const openEditModal = (activity) => {
    setModalData({ ...activity });
  };

  const closeModal = () => setModalData(null);

  const hasOverlap = (candidate) => {
    return activitiesByDay[candidate.day].some((a) => {
      if (a.id === candidate.id) return false;
      return candidate.startHour < a.endHour && candidate.endHour > a.startHour;
    });
  };

  const handleSave = (form) => {
    if (!form.title.trim()) {
      Swal.fire({ icon: 'warning', title: 'Falta el título', text: 'Ingresá un nombre para la actividad.' });
      return;
    }
    if (form.endHour <= form.startHour) {
      Swal.fire({ icon: 'warning', title: 'Horario inválido', text: 'La hora de fin debe ser posterior a la de inicio.' });
      return;
    }
    if (hasOverlap(form)) {
      Swal.fire({ icon: 'error', title: 'Superposición', text: 'Ya existe otra actividad en ese horario y día.' });
      return;
    }

    setActivities((prev) => {
      if (form.id) {
        return prev.map((a) => (a.id === form.id ? { ...form } : a));
      }
      return [...prev, { ...form, id: generateId() }];
    });
    closeModal();
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Eliminar actividad?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6c757d',
    }).then((result) => {
      if (result.isConfirmed) {
        setActivities((prev) => prev.filter((a) => a.id !== id));
        closeModal();
      }
    });
  };

  return (
    <div className="horarios-container">
      <Header />

      <div className="horarios-content">
        <div className="horarios-title-block">
          <h1 className="horarios-title">Mis Horarios</h1>
          <p className="horarios-subtitle">Facultad, gimnasio y entrenamientos — todo en un solo lugar.</p>
        </div>

        <div className="horarios-legend">
          {ACTIVITY_TYPES.map((t) => (
            <div className="legend-item" key={t.label}>
              <span className="legend-dot" style={{ backgroundColor: t.color }} />
              {t.label}
            </div>
          ))}
        </div>

        <div className="schedule-scroll">
          <div
            className="schedule-grid"
            style={{ gridTemplateRows: `50px repeat(${HOURS.length}, 56px)` }}
          >
            <div className="grid-corner" style={{ gridColumn: 1, gridRow: 1 }} />
            {DAYS.map((day, dIdx) => (
              <div className="day-header" key={day} style={{ gridColumn: dIdx + 2, gridRow: 1 }}>
                {day}
              </div>
            ))}

            {HOURS.map((hour, hIdx) => (
              <div
                className="hour-label"
                key={hour}
                style={{ gridColumn: 1, gridRow: hIdx + 2 }}
              >
                {formatHour(hour)}
              </div>
            ))}

            {DAYS.map((_, dIdx) =>
              HOURS.map((hour, hIdx) => (
                <button
                  type="button"
                  key={`${dIdx}-${hour}`}
                  className="empty-cell"
                  style={{ gridColumn: dIdx + 2, gridRow: hIdx + 2 }}
                  onClick={() => openAddModal(dIdx, hour)}
                  aria-label={`Agregar actividad ${DAYS[dIdx]} ${formatHour(hour)}`}
                >
                  <span className="empty-cell-plus">+</span>
                </button>
              ))
            )}

            {activities.map((a) => {
              const startIdx = a.startHour - START_HOUR;
              const endIdx = a.endHour - START_HOUR;
              return (
                <button
                  type="button"
                  key={a.id}
                  className="activity-block"
                  style={{
                    gridColumn: a.day + 2,
                    gridRow: `${startIdx + 2} / ${endIdx + 2}`,
                    backgroundColor: colorForType(a.type),
                  }}
                  onClick={() => openEditModal(a)}
                >
                  <span className="activity-title">{a.title}</span>
                  <span className="activity-time">{formatHour(a.startHour)} - {formatHour(a.endHour)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {modalData && (
        <ActivityModal
          form={modalData}
          onChange={setModalData}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

const ActivityModal = ({ form, onChange, onSave, onDelete, onClose }) => {
  const isEditing = !!form.id;
  const set = (field) => (value) => onChange({ ...form, [field]: value });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{isEditing ? 'Editar actividad' : 'Nueva actividad'}</h2>

        <div className="modal-field">
          <label>Título *</label>
          <input
            type="text"
            placeholder="Ej: Álgebra, Entrenamiento piernas..."
            value={form.title}
            onChange={(e) => set('title')(e.target.value)}
          />
        </div>

        <div className="modal-field">
          <label>Tipo</label>
          <CustomSelect
            options={ACTIVITY_TYPES.map((t) => t.label)}
            value={form.type}
            onChange={set('type')}
          />
        </div>

        <div className="modal-field">
          <label>Día</label>
          <CustomSelect
            options={DAYS}
            value={DAYS[form.day]}
            onChange={(dayLabel) => set('day')(DAYS.indexOf(dayLabel))}
          />
        </div>

        <div className="modal-row">
          <div className="modal-field">
            <label>Hora inicio</label>
            <CustomSelect
              options={HOURS.map(formatHour)}
              value={formatHour(form.startHour)}
              onChange={(h) => set('startHour')(HOURS[HOURS.map(formatHour).indexOf(h)])}
            />
          </div>
          <div className="modal-field">
            <label>Hora fin</label>
            <CustomSelect
              options={[...HOURS.slice(1), END_HOUR].map(formatHour)}
              value={formatHour(form.endHour)}
              onChange={(h) => {
                const allEnds = [...HOURS.slice(1), END_HOUR];
                set('endHour')(allEnds[allEnds.map(formatHour).indexOf(h)]);
              }}
            />
          </div>
        </div>

        <div className="modal-field">
          <label>Notas (opcional)</label>
          <textarea
            rows={3}
            placeholder="Aula, sede, detalles..."
            value={form.notes}
            onChange={(e) => set('notes')(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          {isEditing && (
            <button type="button" className="btn-delete" onClick={() => onDelete(form.id)}>
              Eliminar
            </button>
          )}
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn-submit" onClick={() => onSave(form)}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorariosPage;
