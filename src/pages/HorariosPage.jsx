import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Swal from 'sweetalert2';
import {
  FaGraduationCap,
  FaDumbbell,
  FaBookOpen,
  FaBriefcase,
  FaEllipsis,
  FaPlus,
  FaXmark,
  FaTrashCan,
  FaClock,
  FaCalendarDay,
} from 'react-icons/fa6';
import Header from '../components/header';
import { CustomSelect } from '../components/custom_select';
import '../compCSS/HorariosPage.css';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DAYS_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const START_HOUR = 8;
const END_HOUR = 23; // último bloque termina a las 23:00
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
const STORAGE_KEY = 'horarios_activities_v1';

const ACTIVITY_TYPES = [
  { label: 'Cursada', color: '#6366F1', icon: FaGraduationCap },
  { label: 'Gimnasio', color: '#FB7185', icon: FaDumbbell },
  { label: 'Estudio', color: '#34D399', icon: FaBookOpen },
  { label: 'Trabajo', color: '#FBBF24', icon: FaBriefcase },
  { label: 'Otro', color: '#38BDF8', icon: FaEllipsis },
];

const typeInfo = (type) => ACTIVITY_TYPES.find((t) => t.label === type) || ACTIVITY_TYPES[4];
const formatHour = (h) => `${String(h).padStart(2, '0')}:00`;
const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const shade = (hex, percent) => {
  const num = parseInt(hex.slice(1), 16);
  const clamp = (v) => Math.min(255, Math.max(0, v));
  const r = clamp((num >> 16) + percent);
  const g = clamp(((num >> 8) & 0x00ff) + percent);
  const b = clamp((num & 0x0000ff) + percent);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const hexToRgba = (hex, alpha) => {
  const num = parseInt(hex.slice(1), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const activitiesByDay = useMemo(() => {
    const map = {};
    DAYS.forEach((_, idx) => { map[idx] = []; });
    activities.forEach((a) => map[a.day]?.push(a));
    return map;
  }, [activities]);

  const totalHours = useMemo(
    () => activities.reduce((sum, a) => sum + (a.endHour - a.startHour), 0),
    [activities]
  );

  const todayIndex = (now.getDay() + 6) % 7;
  const nowHour = now.getHours();
  const nowMinuteFraction = now.getMinutes() / 60;
  const showNowLine = nowHour >= START_HOUR && nowHour < END_HOUR;
  const nowRowIdx = nowHour - START_HOUR;

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
      background: '#171717',
      color: '#fff',
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
        <div className="horarios-hero">
          <div className="hero-glow hero-glow-1" />
          <div className="hero-glow hero-glow-2" />

          <div className="horarios-title-block">
            <span className="horarios-eyebrow">
              <FaCalendarDay /> Agenda semanal
            </span>
            <h1 className="horarios-title">Mis Horarios</h1>
            <p className="horarios-subtitle">Facultad, gimnasio y entrenamientos — todo en un solo lugar.</p>

            <div className="horarios-stats">
              <div className="stat-chip">
                <FaClock />
                <span><strong>{totalHours}</strong> hs / semana</span>
              </div>
              <div className="stat-chip">
                <FaCalendarDay />
                <span><strong>{activities.length}</strong> actividades</span>
              </div>
            </div>
          </div>
        </div>

        <div className="horarios-legend">
          {ACTIVITY_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <div
                className="legend-item"
                key={t.label}
                style={{ '--type-color': t.color, backgroundColor: hexToRgba(t.color, 0.12), borderColor: hexToRgba(t.color, 0.35) }}
              >
                <Icon style={{ color: t.color }} />
                {t.label}
              </div>
            );
          })}
        </div>

        <div className="schedule-scroll">
          <div
            className="schedule-grid"
            style={{ gridTemplateRows: `54px repeat(${HOURS.length}, 56px)` }}
          >
            <div className="grid-corner" style={{ gridColumn: 1, gridRow: 1 }} />
            {DAYS.map((day, dIdx) => (
              <div
                className={`day-header ${dIdx === todayIndex ? 'today' : ''}`}
                key={day}
                style={{ gridColumn: dIdx + 2, gridRow: 1 }}
              >
                <span className="day-header-full">{day}</span>
                <span className="day-header-short">{DAYS_SHORT[dIdx]}</span>
                {dIdx === todayIndex && <span className="today-dot" />}
              </div>
            ))}

            {HOURS.map((hour, hIdx) => (
              <div className="hour-label" key={hour} style={{ gridColumn: 1, gridRow: hIdx + 2 }}>
                {formatHour(hour)}
              </div>
            ))}

            {DAYS.map((_, dIdx) => dIdx === todayIndex && (
              <div
                key="today-column"
                className="today-column"
                style={{ gridColumn: dIdx + 2, gridRow: `2 / ${HOURS.length + 2}` }}
              />
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
                  <FaPlus className="empty-cell-plus" />
                </button>
              ))
            )}

            {activities.map((a) => {
              const startIdx = a.startHour - START_HOUR;
              const endIdx = a.endHour - START_HOUR;
              const info = typeInfo(a.type);
              const Icon = info.icon;
              return (
                <button
                  type="button"
                  key={a.id}
                  className="activity-block"
                  style={{
                    gridColumn: a.day + 2,
                    gridRow: `${startIdx + 2} / ${endIdx + 2}`,
                    background: `linear-gradient(155deg, ${hexToRgba(info.color, 0.9)}, ${hexToRgba(shade(info.color, -35), 0.95)})`,
                    borderColor: hexToRgba(info.color, 0.6),
                    boxShadow: `0 8px 20px -8px ${hexToRgba(info.color, 0.55)}`,
                  }}
                  onClick={() => openEditModal(a)}
                >
                  <span className="activity-icon"><Icon /></span>
                  <span className="activity-body">
                    <span className="activity-title">{a.title}</span>
                    <span className="activity-time">{formatHour(a.startHour)} - {formatHour(a.endHour)}</span>
                  </span>
                </button>
              );
            })}

            {showNowLine && (
              <div className="now-track" style={{ gridColumn: `2 / -1`, gridRow: nowRowIdx + 2 }}>
                <div className="now-line" style={{ top: `${nowMinuteFraction * 100}%` }}>
                  <span className="now-dot" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalData && (
          <ActivityModal
            form={modalData}
            onChange={setModalData}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ActivityModal = ({ form, onChange, onSave, onDelete, onClose }) => {
  const isEditing = !!form.id;
  const set = (field) => (value) => onChange({ ...form, [field]: value });
  const selectedType = typeInfo(form.type);
  const SelectedIcon = selectedType.icon;

  return (
    <motion.div
      className="modal-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
          <FaXmark />
        </button>

        <div className="modal-header">
          <span className="modal-header-icon" style={{ backgroundColor: hexToRgba(selectedType.color, 0.18), color: selectedType.color }}>
            <SelectedIcon />
          </span>
          <h2 className="modal-title">{isEditing ? 'Editar actividad' : 'Nueva actividad'}</h2>
        </div>

        <div className="modal-field">
          <label>Título</label>
          <input
            type="text"
            placeholder="Ej: Álgebra, Entrenamiento piernas..."
            value={form.title}
            onChange={(e) => set('title')(e.target.value)}
            autoFocus
          />
        </div>

        <div className="modal-field">
          <label>Tipo</label>
          <div className="type-picker">
            {ACTIVITY_TYPES.map((t) => {
              const Icon = t.icon;
              const active = form.type === t.label;
              return (
                <button
                  type="button"
                  key={t.label}
                  className={`type-chip ${active ? 'active' : ''}`}
                  style={{
                    '--chip-color': t.color,
                    backgroundColor: active ? hexToRgba(t.color, 0.22) : 'rgba(255,255,255,0.03)',
                    borderColor: active ? t.color : 'rgba(255,255,255,0.1)',
                    color: active ? t.color : '#ccc',
                  }}
                  onClick={() => set('type')(t.label)}
                >
                  <Icon /> {t.label}
                </button>
              );
            })}
          </div>
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
            rows={2}
            placeholder="Aula, sede, detalles..."
            value={form.notes}
            onChange={(e) => set('notes')(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          {isEditing && (
            <button type="button" className="btn-delete" onClick={() => onDelete(form.id)}>
              <FaTrashCan /> Eliminar
            </button>
          )}
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn-submit" onClick={() => onSave(form)}>
            Guardar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HorariosPage;
