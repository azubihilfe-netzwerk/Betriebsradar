import React, { FC, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { MapBounds, MapCompany } from '../../lib/companyFilters';

const pinIcon = L.divIcon({
  className: '',
  html: `
    <svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 27 15 27s15-16.5 15-27C30 6.7 23.3 0 15 0z"
        fill="#c3c2ee" stroke="#242424" stroke-width="1.5"/>
      <circle cx="15" cy="15" r="5.5" fill="#242424"/>
    </svg>
  `,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -38],
});

export interface MapView {
  center: [number, number];
  zoom: number;
  bounds: MapBounds;
}

const MapEventsListener: FC<{ onViewChange: (view: MapView) => void }> = ({ onViewChange }) => {
  const map = useMapEvents({
    moveend: () => reportView(),
  });

  const reportView = () => {
    const bounds = map.getBounds();
    const center = map.getCenter();
    onViewChange({
      center: [center.lat, center.lng],
      zoom: map.getZoom(),
      bounds: {
        south: bounds.getSouth(),
        west: bounds.getWest(),
        north: bounds.getNorth(),
        east: bounds.getEast(),
      },
    });
  };

  // Report the initial viewport once on mount, so consumers (e.g. a company list)
  // don't have to wait for the first pan/zoom to know what's currently visible.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(reportView, []);

  return null;
};

interface CompanyMapProps {
  companies: MapCompany[];
  center: [number, number];
  zoom: number;
  onViewChange: (view: MapView) => void;
  className?: string;
}

const CompanyMap: FC<CompanyMapProps> = ({ companies, center, zoom, onViewChange, className }) => {
  const markers = companies.filter(
    (c): c is MapCompany & { latitude: number; longitude: number } =>
      c.latitude != null && c.longitude != null
  );

  return (
    // isolate: Leaflet's own panes/controls use z-index up to 1000, which otherwise
    // compares directly against page chrome (navbar, sidebar) in the root stacking
    // context. Containing it here keeps all of that trapped behind our overlay UI.
    <div className={`relative isolate ${className ?? ''}`}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventsListener onViewChange={onViewChange} />
        {markers.map((company) => (
          <Marker key={company.id} position={[company.latitude, company.longitude]} icon={pinIcon}>
            <Popup className="company-popup border-standard" minWidth={200}>
                <div className="bg-brand-surface px-4 py-2 text-center">
                  <p className="font-bold leading-snug text-blackish">{company.name}</p>
                  {company.trade && <p className="mt-1 text-sm text-blackish">{company.trade}</p>}
                </div>
                 <Link to={`/unternehmen/${company.id}`} className="block">
                <div className="bg-brand-button px-4 py-3 text-center border-standard -mr-1 -ml-1 -mb-1 font-bold text-blackish underline active:bg-brand-button-hover">
                  {company.reviewsCount ?? 0} Berichte lesen
                </div>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CompanyMap;
