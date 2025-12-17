import { GeoCoordinates } from '../types';

/**
 * Service Stub for Google Maps (Geocoding & Places)
 */

class GoogleMapsService {
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Obter posição atual do usuário via Browser API
  async getCurrentPosition(): Promise<GeoCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada pelo navegador.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Erro ao obter localização', error);
          reject(error);
        }
      );
    });
  }

  // Converter endereço em coordenadas (Stub com coordenadas fixas de SP para demo, mas simula delay)
  async geocode(address: string): Promise<GeoCoordinates> {
    await this.delay(600);
    console.log(`[G-Maps] Geocoding address: ${address}`);
    
    // Mock coordinates (São Paulo center approx)
    // Em produção, chamaria a API Geocoding do Google
    return {
      lat: -23.550520,
      lng: -46.633308
    };
  }

  // Calcular distância em Km usando fórmula de Haversine
  calculateDistance(coords1: GeoCoordinates, coords2: GeoCoordinates): number {
    const toRad = (x: number) => (x * Math.PI) / 180;

    const R = 6371; // Raio da Terra em km
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lng - coords1.lng);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return parseFloat((R * c).toFixed(1));
  }

  // Wrapper assíncrono para manter compatibilidade com chamadas de API futuras
  async getDistance(origin: GeoCoordinates, destination: GeoCoordinates): Promise<string> {
    const dist = this.calculateDistance(origin, destination);
    return `${dist} km`;
  }

  // Gerar link de rota
  getDirectionsLink(destinationAddress: string): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationAddress)}`;
  }
  
  // Gerar link de busca
  getSearchLink(query: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
}

export const maps = new GoogleMapsService();