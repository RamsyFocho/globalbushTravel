import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Mock destination data with prices (ready for Duffel API integration)
const mockDestinations = [
  {
    id: 1,
    city: "New York",
    country: "USA",
    lat: 40.7128,
    lng: -74.006,
    price: 1643570,
  },
  {
    id: 2,
    city: "London",
    country: "UK",
    lat: 51.5074,
    lng: -0.1278,
    price: 1170600,
  },
  {
    id: 3,
    city: "Paris",
    country: "France",
    lat: 48.8566,
    lng: 2.3522,
    price: 1817760,
  },
  {
    id: 4,
    city: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lng: 139.6503,
    price: 2326810,
  },
  {
    id: 5,
    city: "Dubai",
    country: "UAE",
    lat: 25.2048,
    lng: 55.2708,
    price: 1477040,
  },
  {
    id: 6,
    city: "Sydney",
    country: "Australia",
    lat: -33.8688,
    lng: 151.2093,
    price: 3011900,
  },
  {
    id: 7,
    city: "Singapore",
    country: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    price: 1653790,
  },
  {
    id: 8,
    city: "Bangkok",
    country: "Thailand",
    lat: 13.7563,
    lng: 100.5018,
    price: 2339330,
  },
  {
    id: 9,
    city: "Mumbai",
    country: "India",
    lat: 19.076,
    lng: 72.8777,
    price: 944643,
  },
  {
    id: 10,
    city: "Lagos",
    country: "Nigeria",
    lat: 6.5244,
    lng: 3.3792,
    price: 811939,
  },
  {
    id: 11,
    city: "São Paulo",
    country: "Brazil",
    lat: -23.5505,
    lng: -46.6333,
    price: 2546510,
  },
  {
    id: 12,
    city: "Cairo",
    country: "Egypt",
    lat: 30.0444,
    lng: 31.2357,
    price: 1200000,
  },
];

// Format price for display
const formatPrice = (price: number) => {
  return `${price.toLocaleString()}FCFA`;
};

export interface InteractiveMapRef {
  highlightDestination: (destinationId: number) => void;
}

interface InteractiveMapProps {
  onDestinationClick?: (destinationId: number) => void;
}

const InteractiveMap = forwardRef<InteractiveMapRef, InteractiveMapProps>(
  ({ onDestinationClick }, ref) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const specialMarkerRef = useRef<L.Marker | null>(null);

    useImperativeHandle(ref, () => ({
      highlightDestination: (destinationId: number) => {
        const destination = mockDestinations.find(
          (d) => d.id === destinationId
        );
        if (!destination || !mapInstance.current) return;

        // Add special marker icon (do NOT remove other markers)
        if (specialMarkerRef.current) {
          mapInstance.current.removeLayer(specialMarkerRef.current);
        }
        const specialIcon = L.divIcon({
          className: "special-marker",
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
              <div style="background: #ef4444; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 700; font-size: 13px; box-shadow: 0 2px 8px rgba(239,68,68,0.3); border: 2px solid white;">
                ${formatPrice(destination.price)}
              </div>
              <svg width="18" height="10" viewBox="0 0 18 10" style="display:block; margin-top:-2px;" xmlns="http://www.w3.org/2000/svg">
                <polygon points="9,10 0,0 18,0" fill="#ef4444" />
                <polygon points="9,8 2,1 16,1" fill="white" />
              </svg>
            </div>
          `,
          iconSize: [60, 38],
          iconAnchor: [30, 38],
        });
        specialMarkerRef.current = L.marker(
          [destination.lat, destination.lng],
          { icon: specialIcon, zIndexOffset: 1000 }
        ).addTo(mapInstance.current);
        mapInstance.current.setView([destination.lat, destination.lng], 8, {
          animate: true,
        });
      },
    }));

    useEffect(() => {
      if (!mapRef.current || mapInstance.current) return;
      mapInstance.current = L.map(mapRef.current).setView([20, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);
      const group = new L.FeatureGroup();
      mockDestinations.forEach((destination) => {
        // Rectangular marker with pointer (arrow) at the bottom center
        const priceIcon = L.divIcon({
          className: "custom-price-marker",
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
              <div style="background: #0891b2; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 700; font-size: 13px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid white;">
                ${formatPrice(destination.price)}
              </div>
              <svg width="18" height="10" viewBox="0 0 18 10" style="display:block; margin-top:-2px;" xmlns="http://www.w3.org/2000/svg">
                <polygon points="9,10 0,0 18,0" fill="#0891b2" />
                <polygon points="9,8 2,1 16,1" fill="white" />
              </svg>
            </div>
          `,
          iconSize: [60, 38],
          iconAnchor: [30, 38],
        });
        const marker = L.marker([destination.lat, destination.lng], {
          icon: priceIcon,
        }).addTo(mapInstance.current!);
        group.addLayer(marker);
        markersRef.current.push(marker);
        const popupContent = `
        <div style="text-align: center; padding: 8px;">
          <h3 style="font-weight: 600; font-size: 18px; margin: 0 0 4px 0;">${
            destination.city
          }</h3>
          <p style="color: #666; margin: 0 0 8px 0;">${destination.country}</p>
          <p style="color: #0891b2; font-weight: bold; margin: 0 0 8px 0; width:full">
            from ${formatPrice(destination.price)}
          </p>
          <button style="
            margin-top: 8px;
            padding: 8px 16px;
            background: #0891b2;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
          " onmouseover="this.style.background='#0e7490'" onmouseout="this.style.background='#0891b2'">
            View Flights
          </button>
        </div>
      `;
        marker.bindPopup(popupContent);
        marker.on("click", () => {
          onDestinationClick?.(destination.id);
        });
      });
      if (group.getLayers().length > 0) {
        mapInstance.current.fitBounds(group.getBounds(), {
          padding: [20, 20],
        });
      }
      return () => {
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }
        markersRef.current = [];
        specialMarkerRef.current = null;
      };
    }, [onDestinationClick]);

    return (
      <div className="h-96 md:h-[500px] w-full relative transition-all duration-500">
        <div
          ref={mapRef}
          style={{ height: "100%", width: "100%" }}
          className="rounded-lg transition-all duration-500"
        />
      </div>
    );
  }
);

InteractiveMap.displayName = "InteractiveMap";

export default InteractiveMap;
