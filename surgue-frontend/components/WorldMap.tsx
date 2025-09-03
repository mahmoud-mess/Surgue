import { useRef, useEffect } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

interface WorldMapProps {
  removedCountryCode: string | null;
}

const WorldMap = ({ removedCountryCode }: WorldMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 20],
      zoom: 1,
    });

    map.current.on('load', () => {
        // Source uses TopoJSON for smaller file size
        map.current?.addSource('countries', {
            type: 'vector',
            url: 'mapbox://mapbox.country-boundaries-v1', // Using Mapbox's high-quality dataset
        });

        map.current?.addLayer({
            'id': 'country-fills',
            'type': 'fill',
            'source': 'countries',
            'source-layer': 'country_boundaries',
            'layout': {},
            'paint': {
                'fill-color': '#627BC1',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'removed'], false],
                    0.1, // Opacity when removed
                    0.5  // Default opacity
                ],
                'fill-outline-color': '#A6B5E3',
            }
        });
    });
  }, []);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded() || !removedCountryCode) return;
    
    // Set feature state to trigger the opacity change in the paint property
    map.current.setFeatureState(
        { source: 'countries', sourceLayer: 'country_boundaries', id: removedCountryCode },
        { removed: true }
    );

  }, [removedCountryCode]);

  return <div ref={mapContainer} className="w-full h-64 md:h-96 rounded-lg" />;
};

export default WorldMap;