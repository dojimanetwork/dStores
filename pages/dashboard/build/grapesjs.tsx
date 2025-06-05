import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, EyeIcon, CodeBracketIcon, DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export default function GrapesJSBuilder() {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    // Dynamically load GrapesJS
    const loadGrapesJS = async () => {
      try {
        // Load GrapesJS CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/grapesjs/dist/css/grapes.min.css';
        document.head.appendChild(link);

        // Load GrapesJS JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/grapesjs';
        script.onload = () => {
          initializeEditor();
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load GrapesJS:', error);
        setIsLoading(false);
      }
    };

    const initializeEditor = () => {
      if (editorRef.current && (window as any).grapesjs) {
        const editor = (window as any).grapesjs.init({
          container: editorRef.current,
          height: '600px',
          width: 'auto',
          storageManager: false,
          blockManager: {
            appendTo: '#blocks',
          },
          styleManager: {
            appendTo: '#styles',
          },
          layerManager: {
            appendTo: '#layers',
          },
          traitManager: {
            appendTo: '#traits',
          },
          selectorManager: {
            appendTo: '#selectors',
          },
          panels: {
            defaults: [
              {
                id: 'basic-actions',
                el: '.panel__basic-actions',
                buttons: [
                  {
                    id: 'visibility',
                    active: true,
                    className: 'btn-toggle-borders',
                    label: '<i class="fa fa-clone"></i>',
                    command: 'sw-visibility',
                  },
                  {
                    id: 'export',
                    className: 'btn-open-export',
                    label: '<i class="fa fa-code"></i>',
                    command: 'export-template',
                    context: 'export-template',
                  },
                  {
                    id: 'show-json',
                    className: 'btn-show-json',
                    label: '<i class="fa fa-download"></i>',
                    context: 'show-json',
                    command(editor: any) {
                      editor.Modal.setTitle('Components JSON')
                        .setContent(`<textarea style="width:100%; height: 250px;">
                          ${JSON.stringify(editor.getComponents())}
                        </textarea>`)
                        .open();
                    },
                  }
                ],
              },
              {
                id: 'panel-devices',
                el: '.panel__devices',
                buttons: [
                  {
                    id: 'device-desktop',
                    label: '<i class="fa fa-desktop"></i>',
                    command: 'set-device-desktop',
                    active: true,
                    togglable: false,
                  },
                  {
                    id: 'device-mobile',
                    label: '<i class="fa fa-mobile"></i>',
                    command: 'set-device-mobile',
                    togglable: false,
                  },
                ],
              },
            ],
          },
          deviceManager: {
            devices: [
              {
                name: 'Desktop',
                width: '',
              },
              {
                name: 'Mobile',
                width: '320px',
                widthMedia: '480px',
              },
            ],
          },
          plugins: [],
          pluginsOpts: {},
        });

        // Add some default content
        editor.setComponents(`
          <div style="padding: 20px; text-align: center;">
            <h1>Welcome to Your Web3 Store</h1>
            <p>Start building your digital storefront with our drag-and-drop editor.</p>
            <button style="background: #3B82F6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
              Shop Now
            </button>
          </div>
        `);

        setIsLoading(false);
      }
    };

    loadGrapesJS();

    return () => {
      // Cleanup
      const links = document.querySelectorAll('link[href*="grapesjs"]');
      const scripts = document.querySelectorAll('script[src*="grapesjs"]');
      links.forEach(link => link.remove());
      scripts.forEach(script => script.remove());
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-xl font-semibold">GrapesJS Visual Editor</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Device Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center px-3 py-1 rounded ${
                  viewMode === 'desktop' ? 'bg-white shadow-sm' : ''
                }`}
              >
                <ComputerDesktopIcon className="h-4 w-4 mr-1" />
                Desktop
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center px-3 py-1 rounded ${
                  viewMode === 'mobile' ? 'bg-white shadow-sm' : ''
                }`}
              >
                <DevicePhoneMobileIcon className="h-4 w-4 mr-1" />
                Mobile
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setShowCode(!showCode)}
              className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <CodeBracketIcon className="h-4 w-4 mr-2" />
              {showCode ? 'Hide Code' : 'View Code'}
            </button>

            <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              <EyeIcon className="h-4 w-4 mr-2" />
              Preview
            </button>

            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
              Save & Deploy
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r flex flex-col">
            {/* Blocks Panel */}
            <div className="p-4 border-b">
              <h3 className="font-medium text-gray-900 mb-3">Blocks</h3>
              <div id="blocks" className="min-h-[200px]"></div>
            </div>

            {/* Layers Panel */}
            <div className="p-4 border-b">
              <h3 className="font-medium text-gray-900 mb-3">Layers</h3>
              <div id="layers" className="min-h-[150px]"></div>
            </div>

            {/* Styles Panel */}
            <div className="p-4 flex-1">
              <h3 className="font-medium text-gray-900 mb-3">Styles</h3>
              <div id="styles" className="min-h-[200px]"></div>
            </div>
          </div>

          {/* Main Editor */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
              <div className="panel__basic-actions flex space-x-2"></div>
              <div className="panel__devices flex space-x-2"></div>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading GrapesJS Editor...</p>
                  </div>
                </div>
              ) : (
                <div ref={editorRef} className="h-full"></div>
              )}
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-64 bg-gray-50 border-l">
            <div className="p-4 border-b">
              <h3 className="font-medium text-gray-900 mb-3">Properties</h3>
              <div id="traits" className="min-h-[150px]"></div>
            </div>

            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Selectors</h3>
              <div id="selectors" className="min-h-[100px]"></div>
            </div>
          </div>
        </div>

        {/* Code View Modal */}
        {showCode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-3/4 h-3/4 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Generated Code</h3>
                <button
                  onClick={() => setShowCode(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 p-4">
                <textarea
                  className="w-full h-full font-mono text-sm border rounded p-4"
                  placeholder="Generated HTML/CSS code will appear here..."
                  readOnly
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 