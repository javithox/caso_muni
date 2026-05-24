'use client';

import React, { useState, useEffect } from 'react';
import { Reporte, GeolocationResponse } from '@/types/reporte';
import reporteApi from '@/utils/reporteApi';
import MapContainer from './OpenStreetMapComponent';
import { AlertCircle, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface ReporteFormProps {
  onSubmit?: (reporte: Reporte) => void;
  initialData?: Partial<Reporte>;
}

const ReporteForm: React.FC<ReporteFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Reporte>({
    titulo: initialData?.titulo || '',
    descripcion: initialData?.descripcion || '',
    latitud: initialData?.latitud || 3.4372,
    longitud: initialData?.longitud || -76.5343,
    ubicacionId: initialData?.ubicacionId || '',
    reportadoPor: initialData?.reportadoPor || '',
    contactoEmergencia: initialData?.contactoEmergencia || '',
    nivelSeveridad: initialData?.nivelSeveridad || 3,
    direccion: initialData?.direccion || '',
    areaAfectada: initialData?.areaAfectada || undefined,
    radioInfluencia: initialData?.radioInfluencia || 5,
    fuenteIgnicion: initialData?.fuenteIgnicion || '',
    vegetacionAfectada: initialData?.vegetacionAfectada || '',
    peligroPersonas: initialData?.peligroPersonas || false,
    peligroInfraestructura: initialData?.peligroInfraestructura || false,
    presenciaHumo: initialData?.presenciaHumo || false,
    velocidadViento: initialData?.velocidadViento || undefined,
    temperatura: initialData?.temperatura || undefined,
    accionesTomadas: initialData?.accionesTomadas || '',
    observaciones: initialData?.observaciones || '',
    url_foto: initialData?.url_foto || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Obtener dirección desde coordenadas cuando cambien
  useEffect(() => {
    const getAddressFromCoordinates = async () => {
      if (formData.latitud && formData.longitud && !formData.direccion) {
        setGeoStatus('loading');
        try {
          const response = await reporteApi.reverseGeocode(
            formData.latitud,
            formData.longitud
          );
          if (response.success) {
            setFormData((prev) => ({
              ...prev,
              direccion: response.direccion || prev.direccion,
            }));
            setGeoStatus('success');
          } else {
            setGeoStatus('error');
          }
        } catch (err) {
          setGeoStatus('error');
          console.error('Error en reverse geocoding:', err);
        }
      }
    };

    const timer = setTimeout(getAddressFromCoordinates, 1000);
    return () => clearTimeout(timer);
  }, [formData.latitud, formData.longitud, formData.direccion]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
          ? value
            ? parseFloat(value)
            : undefined
          : value,
    }));
  };

  const handleMapMarkerClick = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitud: lat,
      longitud: lng,
      direccion: '', // Limpiar dirección para obtener la nueva
    }));
  };

  const handleGeocodeAddress = async () => {
    if (!formData.direccion) {
      setError('Por favor ingresa una dirección');
      return;
    }

    setGeoStatus('loading');
    try {
      const response = await reporteApi.geocodeAddress(formData.direccion);
      if (response.success && response.latitud && response.longitud) {
        setFormData((prev) => ({
          ...prev,
          latitud: response.latitud!,
          longitud: response.longitud!,
          placeMapsId: response.placeId,
        }));
        setGeoStatus('success');
        setError(null);
      } else {
        setGeoStatus('error');
        setError(response.message || 'No se pudo geocodificar la dirección');
      }
    } catch (err) {
      setGeoStatus('error');
      setError('Error al geocodificar la dirección');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await reporteApi.crearReporte(formData);
      setSuccess(true);
      setFormData({
        titulo: '',
        descripcion: '',
        latitud: 3.4372,
        longitud: -76.5343,
        ubicacionId: '',
        reportadoPor: '',
        nivelSeveridad: 3,
      });

      if (onSubmit) {
        onSubmit(response);
      }

      // Limpiar success después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Error al crear el reporte');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markers = [
    {
      id: 1,
      titulo: formData.titulo || 'Reporte Nueva',
      latitud: formData.latitud,
      longitud: formData.longitud,
      severidad: formData.nivelSeveridad || 3,
      estado: 'PENDIENTE',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        📋 Crear Nuevo Reporte de Incendio
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-700">✅ Reporte creado exitosamente</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
        <div className="border-t-4 border-blue-500 pt-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📌 Información Básica
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título del Reporte *
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                placeholder="Ej: Incendio forestal sector norte"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reportado Por *
              </label>
              <input
                type="text"
                name="reportadoPor"
                value={formData.reportadoPor}
                onChange={handleInputChange}
                placeholder="Nombre de la persona"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción del Incendio *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Describe los detalles del incendio..."
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contacto de Emergencia
              </label>
              <input
                type="text"
                name="contactoEmergencia"
                value={formData.contactoEmergencia}
                onChange={handleInputChange}
                placeholder="+57 3001234567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Severidad (1-5) *
              </label>
              <select
                name="nivelSeveridad"
                value={formData.nivelSeveridad || 3}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 - Muy Baja</option>
                <option value={2}>2 - Baja</option>
                <option value={3}>3 - Media</option>
                <option value={4}>4 - Alta</option>
                <option value={5}>5 - Muy Alta</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: UBICACIÓN CON GOOGLE MAPS */}
        <div className="border-t-4 border-green-500 pt-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📍 Ubicación (One StreetMaps)
          </h3>

          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Haz clic en el mapa para seleccionar la ubicación, o
              ingresa una dirección y presiona "Geocodificar"
            </p>
          </div>

          {/* Geocodificación */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, direccion: e.target.value }))
                }
                placeholder="Ej: Calle 5 #123, Cali"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={handleGeocodeAddress}
              disabled={geoStatus === 'loading'}
              className="mt-7 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 font-semibold flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              {geoStatus === 'loading' ? 'Buscando...' : 'Geocodificar'}
            </button>
          </div>

          {geoStatus === 'success' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>Ubicación geocodificada exitosamente</span>
            </div>
          )}

          {geoStatus === 'error' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>Error al geocodificar la dirección</span>
            </div>
          )}

          {/* Mapa */}
          <MapContainer
            markers ={markers}
            center={{ lat: formData.latitud, lng: formData.longitud }}
            onMapClick={handleMapMarkerClick}
            height="300px"
          />

          {/* Coordenadas */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Latitud
              </label>
              <input
                type="number"
                name="latitud"
                value={formData.latitud}
                onChange={handleInputChange}
                step="0.0001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitud
              </label>
              <input
                type="number"
                name="longitud"
                value={formData.longitud}
                onChange={handleInputChange}
                step="0.0001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: DETALLES DEL INCENDIO */}
        <div className="border-t-4 border-orange-500 pt-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🔥 Detalles del Incendio
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fuente de Ignición
              </label>
              <select
                name="fuenteIgnicion"
                value={formData.fuenteIgnicion || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecciona...</option>
                <option value="rayo">Rayo</option>
                <option value="negligencia">Negligencia</option>
                <option value="vandalismos">Vandalismos</option>
                <option value="accidental">Accidental</option>
                <option value="desconocida">Desconocida</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Vegetación
              </label>
              <select
                name="vegetacionAfectada"
                value={formData.vegetacionAfectada || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecciona...</option>
                <option value="bosque">Bosque</option>
                <option value="pastos">Pastos</option>
                <option value="matorral">Matorral</option>
                <option value="mezcla">Mezcla</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Área Afectada (hectáreas)
              </label>
              <input
                type="number"
                name="areaAfectada"
                value={formData.areaAfectada || ''}
                onChange={handleInputChange}
                step="0.1"
                placeholder="Ej: 2.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Radio de Influencia (km)
              </label>
              <input
                type="number"
                name="radioInfluencia"
                value={formData.radioInfluencia || ''}
                onChange={handleInputChange}
                step="0.1"
                placeholder="Ej: 5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Peligros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-orange-50">
              <input
                type="checkbox"
                name="peligroPersonas"
                checked={formData.peligroPersonas || false}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-semibold text-gray-700">
                ⚠️ Peligro para personas
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-orange-50">
              <input
                type="checkbox"
                name="peligroInfraestructura"
                checked={formData.peligroInfraestructura || false}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-semibold text-gray-700">
                🏢 Peligro para infraestructura
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-orange-50">
              <input
                type="checkbox"
                name="presenciaHumo"
                checked={formData.presenciaHumo || false}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-semibold text-gray-700">
                💨 Presencia de humo
              </span>
            </label>
          </div>
        </div>

        {/* SECCIÓN 4: CONDICIONES AMBIENTALES */}
        <div className="border-t-4 border-purple-500 pt-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🌡️ Condiciones Ambientales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Temperatura (°C)
              </label>
              <input
                type="number"
                name="temperatura"
                value={formData.temperatura || ''}
                onChange={handleInputChange}
                step="0.1"
                placeholder="Ej: 28.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Velocidad del Viento (km/h)
              </label>
              <input
                type="number"
                name="velocidadViento"
                value={formData.velocidadViento || ''}
                onChange={handleInputChange}
                step="0.1"
                placeholder="Ej: 15.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 5: ACCIONES Y OBSERVACIONES */}
        <div className="border-t-4 border-indigo-500 pt-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📝 Acciones y Observaciones
          </h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Acciones Tomadas
            </label>
            <textarea
              name="accionesTomadas"
              value={formData.accionesTomadas}
              onChange={handleInputChange}
              placeholder="Describe las acciones de respuesta tomadas..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Observaciones Adicionales
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleInputChange}
              placeholder="Notas adicionales..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-bold text-lg transition"
          >
            {loading ? '⏳ Enviando...' : '✅ Crear Reporte'}
          </button>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-bold"
          >
            {showAdvanced ? '▲ Menos opciones' : '▼ Más opciones'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReporteForm;
