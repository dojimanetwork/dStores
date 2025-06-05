import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, EyeIcon, RocketLaunchIcon, StarIcon, PlayIcon, SparklesIcon, BoltIcon, CubeIcon, FireIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, DeviceTabletIcon } from '@heroicons/react/24/outline';
import { DESIGN_TRENDS, ANIMATION_LEVELS } from './templatesData';

interface TemplatePreviewModalProps {
  template: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (templateId: string) => void;
  productCount: number;
}

export default function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onConfirm,
  productCount
}: TemplatePreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0);
      setViewMode('desktop');
      setIsPlaying(false);
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

  const getAnimationLevelColor = (level: string) => {
    switch (level) {
      case 'subtle': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'moderate': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'dynamic': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'cinematic': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
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
                {/* Header with Glow Effect */}
                <div 
                  className="relative px-8 py-6 text-white overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${template.colorScheme.primary} 0%, ${template.colorScheme.secondary === '#FFFFFF' ? template.colorScheme.accent : template.colorScheme.secondary} 100%)`
                  }}
                >
                  {/* Glow Effect */}
                  {template.colorScheme.glow && (
                    <div 
                      className="absolute inset-0 opacity-30 blur-2xl"
                      style={{
                        background: `radial-gradient(circle at 30% 50%, ${template.colorScheme.glow}40 0%, transparent 50%)`
                      }}
                    />
                  )}
                  
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
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm ${getAnimationLevelColor(template.animationLevel).replace('text-', 'text-white').replace('bg-', 'bg-white bg-opacity-20').replace('border-', 'border-white border-opacity-30')}`}>
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
                  {/* Sidebar */}
                  <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                    <div className="p-6">
                      {/* Template Info */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">About This Template</h4>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {template.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Designer</span>
                            <span className="text-sm font-medium text-gray-900">{template.designer}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Category</span>
                            <span className="text-sm font-medium text-gray-900">{template.category}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Layout Type</span>
                            <span className="text-sm font-medium text-gray-900 capitalize">{template.layout}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Pages</span>
                            <span className="text-sm font-medium text-gray-900">{template.pages.length}</span>
                          </div>
                        </div>
                      </div>

                      {/* Design Trends */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Design Trends</h4>
                        <div className="flex flex-wrap gap-2">
                          {template.designTrends.map((trend: string) => (
                            <span
                              key={trend}
                              className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs rounded-lg font-medium border border-blue-100"
                            >
                              {DESIGN_TRENDS[trend as keyof typeof DESIGN_TRENDS]}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                        <div className="space-y-2">
                          {template.features.map((feature: string, index: number) => (
                            <div key={index} className="flex items-center gap-3">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: template.colorScheme.accent }}
                              />
                              <span className="text-sm text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Color Scheme */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Color Scheme</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded-lg border border-gray-200 shadow-sm"
                              style={{ backgroundColor: template.colorScheme.primary }}
                            />
                            <div>
                              <div className="text-xs font-medium text-gray-900">Primary</div>
                              <div className="text-xs text-gray-500">{template.colorScheme.primary}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded-lg border border-gray-200 shadow-sm"
                              style={{ backgroundColor: template.colorScheme.accent }}
                            />
                            <div>
                              <div className="text-xs font-medium text-gray-900">Accent</div>
                              <div className="text-xs text-gray-500">{template.colorScheme.accent}</div>
                            </div>
                          </div>
                          {template.colorScheme.glow && (
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-6 h-6 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden"
                                style={{ backgroundColor: template.colorScheme.glow }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
                              </div>
                              <div>
                                <div className="text-xs font-medium text-gray-900">Glow</div>
                                <div className="text-xs text-gray-500">{template.colorScheme.glow}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Page Navigation */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Pages ({template.pages.length})</h4>
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
                              <div className="text-xs text-gray-500 mt-1">{page.key}</div>
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
                          
                          {/* Glow Overlay */}
                          {template.colorScheme.glow && (
                            <div 
                              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                              style={{
                                background: `radial-gradient(circle at center, ${template.colorScheme.glow}40 0%, transparent 70%)`
                              }}
                            />
                          )}
                          
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
                          
                          {/* Play Demo Button */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="px-6 py-3 bg-white bg-opacity-90 backdrop-blur-sm text-gray-900 rounded-full font-medium shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2 hover:scale-105"
                            >
                              <PlayIcon className="w-5 h-5" />
                              {isPlaying ? 'Pause Demo' : 'Play Demo'}
                            </button>
                          </div>
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
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                      >
                        <RocketLaunchIcon className="w-5 h-5" />
                        Choose This Template
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