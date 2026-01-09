'use client';

import { LoadScript } from '@react-google-maps/api';
import AppLoader from '../shared/app-loader';

const libraries: 'places'[] = ['places'];

export default function GoogleProvider({ children }: { children: React.ReactNode }) {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={libraries}
      loadingElement={<AppLoader />}
    >
      {children}
    </LoadScript>
  );
}
