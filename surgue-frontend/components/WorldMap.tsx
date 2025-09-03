import { useRef, useEffect } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

interface WorldMapProps {
  revealedCountryCode: string | null;
}

const WorldMap = ({ revealedCountryCode }: WorldMapProps) => {
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
                'fill-color': [
                    'case',
                    ['boolean', ['feature-state', 'celebrating'], false],
                    '#FF0000', // Bright red when celebrating (more visible)
                    ['boolean', ['feature-state', 'hovered'], false],
                    '#FFD700', // Gold when hovered
                    ['boolean', ['feature-state', 'revealed'], false],
                    '#627BC1', // Blue when revealed
                    '#627BC1'  // Default blue
                ],
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'celebrating'], false],
                    1.0, // Full opacity when celebrating
                    ['boolean', ['feature-state', 'hovered'], false],
                    0.9, // High opacity when hovered
                    ['boolean', ['feature-state', 'revealed'], false],
                    0.8, // Opacity when revealed
                    0.0  // Completely invisible when not revealed
                ],
                'fill-outline-color': [
                    'case',
                    ['boolean', ['feature-state', 'celebrating'], false],
                    '#FFFFFF', // White outline when celebrating (more visible)
                    ['boolean', ['feature-state', 'hovered'], false],
                    '#FFA500', // Orange outline when hovered
                    ['boolean', ['feature-state', 'revealed'], false],
                    '#A6B5E3', // Light blue outline when revealed
                    '#A6B5E3'  // Default outline
                ],
                'fill-outline-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'celebrating'], false],
                    1.0, // Full outline opacity when celebrating
                    ['boolean', ['feature-state', 'hovered'], false],
                    0.8, // High outline opacity when hovered
                    ['boolean', ['feature-state', 'revealed'], false],
                    0.6, // Outline visible when revealed
                    0.0  // No outline when not revealed
                ],
            }
        });

        // Add hover effects - ensure only one country highlighted at a time
        map.current.on('mouseenter', 'country-fills', (e) => {
            if (e.features && e.features.length > 0) {
                const feature = e.features[0];
                if (feature.id !== undefined) {
                    // Clear all hover states first to ensure only one country is highlighted
                    map.current?.setFeatureState(
                        { source: 'countries', sourceLayer: 'country_boundaries' },
                        { hovered: false }
                    );
                    // Set hover for current feature
                    map.current?.setFeatureState(
                        { source: 'countries', sourceLayer: 'country_boundaries', id: feature.id },
                        { hovered: true }
                    );
                }
            }
        });

        map.current.on('mouseleave', 'country-fills', () => {
            // Clear all hover states when leaving any country
            map.current?.setFeatureState(
                { source: 'countries', sourceLayer: 'country_boundaries' },
                { hovered: false }
            );
        });

        // Also clear hover states when mouse leaves the entire map
        map.current.on('mouseleave', () => {
            map.current?.setFeatureState(
                { source: 'countries', sourceLayer: 'country_boundaries' },
                { hovered: false }
            );
        });

        // Add mousemove to handle smooth transitions between countries
        map.current.on('mousemove', 'country-fills', (e) => {
            if (e.features && e.features.length > 0) {
                const feature = e.features[0];
                if (feature.id !== undefined) {
                    // Clear all hover states first
                    map.current?.setFeatureState(
                        { source: 'countries', sourceLayer: 'country_boundaries' },
                        { hovered: false }
                    );
                    // Set hover for current feature
                    map.current?.setFeatureState(
                        { source: 'countries', sourceLayer: 'country_boundaries', id: feature.id },
                        { hovered: true }
                    );
                }
            }
        });

        // Change cursor on hover
        map.current.on('mouseenter', 'country-fills', () => {
            if (map.current) {
                map.current.getCanvas().style.cursor = 'pointer';
            }
        });

        map.current.on('mouseleave', 'country-fills', () => {
            if (map.current) {
                map.current.getCanvas().style.cursor = '';
            }
        });

        // Click handler removed - no popup needed
    });
  }, []);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded() || !revealedCountryCode) return;
    
    console.log('Revealing country:', revealedCountryCode); // Debug
    
    // Set feature state to trigger the opacity change in the paint property
    map.current.setFeatureState(
        { source: 'countries', sourceLayer: 'country_boundaries', id: revealedCountryCode },
        { revealed: true }
    );

    // Add a celebration effect - briefly highlight the revealed country
    setTimeout(() => {
        if (map.current) {
            console.log('Starting celebration for:', revealedCountryCode); // Debug
            map.current.setFeatureState(
                { source: 'countries', sourceLayer: 'country_boundaries', id: revealedCountryCode },
                { revealed: true, celebrating: true }
            );
            
            // Remove celebration effect after 2 seconds
            setTimeout(() => {
                if (map.current) {
                    console.log('Ending celebration for:', revealedCountryCode); // Debug
                    map.current.setFeatureState(
                        { source: 'countries', sourceLayer: 'country_boundaries', id: revealedCountryCode },
                        { revealed: true, celebrating: false }
                    );
                }
            }, 2000);
        }
    }, 100);

  }, [revealedCountryCode]);

  return (
    <div className="relative">
      <div ref={mapContainer} className="w-full h-64 md:h-96 rounded-lg shadow-lg border-2 border-gray-700" />
      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
        🗺️ Interactive Map
      </div>
    </div>
  );
};

export default WorldMap;