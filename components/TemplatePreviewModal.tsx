import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, EyeIcon, RocketLaunchIcon, StarIcon, SparklesIcon, BoltIcon, CubeIcon, FireIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, DeviceTabletIcon } from '@heroicons/react/24/outline';
import { DESIGN_TRENDS, ANIMATION_LEVELS } from './templatesData';

interface TemplatePreviewModalProps {
  template: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (templateId: string) => void;
  productCount: number;
  isSelected: boolean;
}

export default function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onConfirm,
  productCount,
  isSelected
}: TemplatePreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0);
      setViewMode('desktop');
    }
  }, [isOpen]);

  const getAnimationLevelIcon = (level: string) => {
    switch (level) {
      case 'subtle': return <SparklesIcon className="w-4 h-4" />;
      case 'moderate': return <BoltIcon className="w-4 h-4" />;
      case 'dynamic': return <CubeIcon className="w-4 h-4" />;
      case 'cinematic': return <FireIcon className="w-4 h-4" />;
      default: return <SparklesIcon className="w-4 h-4" />;
    }
  };

  const getViewModeIcon = (mode: string) => {
    switch (mode) {
      case 'desktop': return <ComputerDesktopIcon className="w-4 h-4" />;
      case 'tablet': return <DeviceTabletIcon className="w-4 h-4" />;
      case 'mobile': return <DevicePhoneMobileIcon className="w-4 h-4" />;
      default: return <ComputerDesktopIcon className="w-4 h-4" />;
    }
  };

  const getViewModeClass = () => {
    switch (viewMode) {
      case 'desktop': return 'w-full h-full';
      case 'tablet': return 'w-3/4 h-5/6 mx-auto';
      case 'mobile': return 'w-80 h-full mx-auto';
      default: return 'w-full h-full';
    }
  };

  const currentPageData = template.pages[currentPage];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div 
                  className="relative px-8 py-6 text-white overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${template.colorScheme.primary} 0%, ${template.colorScheme.secondary === '#FFFFFF' ? template.colorScheme.accent : template.colorScheme.secondary} 100%)`
                  }}
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <Dialog.Title as="h3" className="text-2xl font-bold leading-6 mb-2">
                          {template.name}
                        </Dialog.Title>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-5 h-5 text-yellow-400" />
                            <span className="font-medium">Award Winner</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm bg-white bg-opacity-20 border-white border-opacity-30 text-white">
                            {getAnimationLevelIcon(template.animationLevel)}
                            {ANIMATION_LEVELS[template.animationLevel as keyof typeof ANIMATION_LEVELS]}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* View Mode Toggle */}
                      <div className="flex items-center gap-1 bg-white bg-opacity-20 rounded-xl p-1 backdrop-blur-sm">
                        {['desktop', 'tablet', 'mobile'].map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setViewMode(mode as any)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              viewMode === mode
                                ? 'bg-white text-gray-900 shadow-lg'
                                : 'text-white hover:bg-white hover:bg-opacity-20'
                            }`}
                          >
                            {getViewModeIcon(mode)}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex h-[80vh]">
                  {/* Minimal Sidebar */}
                  <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                    <div className="p-6">
                      {/* Template Basic Info */}
                      <div className="mb-8">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Category</span>
                            <span className="text-sm font-medium text-gray-900">{template.category}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Pages</span>
                            <span className="text-sm font-medium text-gray-900">{template.pages.length}</span>
                          </div>
                        </div>
                      </div>

                      {/* Page Navigation */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Pages</h4>
                        <div className="space-y-2">
                          {template.pages.map((page: any, index: number) => (
                            <button
                              key={index}
                              onClick={() => setCurrentPage(index)}
                              className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                                currentPage === index
                                  ? 'bg-blue-100 border border-blue-200 text-blue-900'
                                  : 'hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              <div className="font-medium text-sm">{page.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview Area */}
                  <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
                    <div className={`${getViewModeClass()} relative`}>
                      {/* Device Frame for Mobile/Tablet */}
                      {viewMode !== 'desktop' && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className={`w-full h-full border-8 border-gray-800 rounded-3xl ${
                            viewMode === 'mobile' ? 'border-gray-800' : 'border-gray-600'
                          }`}>
                            {viewMode === 'mobile' && (
                              <>
                                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-600 rounded-full" />
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-gray-600 rounded-full" />
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Template Preview */}
                      <div className={`w-full h-full rounded-2xl shadow-2xl overflow-hidden ${
                        viewMode !== 'desktop' ? 'rounded-3xl' : ''
                      }`}>
                        <div className="relative w-full h-full group">
                          <img
                            src={currentPageData.img}
                            alt={currentPageData.alt}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          
                          {/* Interactive Hotspots */}
                          {currentPageData.nav && (
                            <div className="absolute inset-0">
                              {currentPageData.nav.map((navItem: any, index: number) => (
                                <div
                                  key={index}
                                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                                    index === 0 ? 'top-1/3 left-1/3' :
                                    index === 1 ? 'top-1/2 left-2/3' :
                                    'top-2/3 left-1/2'
                                  }`}
                                >
                                  <div className="group/hotspot relative">
                                    <div 
                                      className="w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-150"
                                      style={{ backgroundColor: template.colorScheme.accent }}
                                    >
                                      <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: template.colorScheme.accent }} />
                                    </div>
                                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/hotspot:opacity-100 transition-opacity duration-200 pointer-events-none">
                                      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
                                        {navItem.label}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">
                        Page {currentPage + 1} of {template.pages.length}: <span className="font-medium">{currentPageData.label}</span>
                      </div>
                      {template.pages.length > 1 && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                            disabled={currentPage === 0}
                            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setCurrentPage(Math.min(template.pages.length - 1, currentPage + 1))}
                            disabled={currentPage === template.pages.length - 1}
                            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      {template.demoUrl && template.demoUrl !== '#' ? (
                        <a
                          href={template.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
                        >
                          <EyeIcon className="w-5 h-5" />
                          Live Demo
                        </a>
                      ) : (
                        <div className="px-6 py-3 bg-gray-300 text-gray-500 rounded-xl font-medium flex items-center gap-2 cursor-not-allowed">
                          <EyeIcon className="w-5 h-5" />
                          Demo Coming Soon
                        </div>
                      )}
                      <button
                        onClick={() => onConfirm(template.id)}
                        className={`px-8 py-3 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 ${
                          isSelected 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                        }`}
                        disabled={isSelected}
                      >
                        <RocketLaunchIcon className="w-5 h-5" />
                        {isSelected ? 'Template Selected' : 'Choose This Template'}
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 