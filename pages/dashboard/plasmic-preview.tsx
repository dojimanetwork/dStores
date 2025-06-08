import React from 'react';
import { GetServerSideProps } from 'next';
import { ComponentRenderData, PlasmicRootProvider, PlasmicComponent } from '@plasmicapp/loader-react';
import { PLASMIC } from '@/lib/plasmic-init';
import DashboardLayout from '@/components/DashboardLayout';

interface PlasmicPreviewProps {
  plasmicData: ComponentRenderData;
}

export default function PlasmicPreview({ plasmicData }: PlasmicPreviewProps) {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Plasmic Component Preview</h1>
          <p className="text-gray-600">Preview how your Plasmic designs render in your dStores app</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <PlasmicRootProvider loader={PLASMIC} prefetchedData={plasmicData}>
            <PlasmicComponent component="Homepage" />
          </PlasmicRootProvider>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch the component data server-side
    const plasmicData = await PLASMIC.fetchComponentData('Homepage');
    
    return {
      props: {
        plasmicData,
      },
    };
  } catch (error) {
    console.error('Error fetching Plasmic data:', error);
    
    return {
      props: {
        plasmicData: null,
      },
    };
  }
}; 