import { useEffect, useRef, useState } from 'react';
import paper from 'paper';
import { IconRegistry } from '@/lib/flow-renderer/icons/IconRegistry';

export function IconExporter() {
  const [status, setStatus] = useState<string>('');
  const [icons, setIcons] = useState<Array<{ key: string; canvas: HTMLCanvasElement }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const allIcons = IconRegistry.getAllIcons();
    const iconElements: Array<{ key: string; canvas: HTMLCanvasElement }> = [];

    allIcons.forEach(({ key, iconClass }) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;

      // Setup Paper.js for this canvas
      paper.setup(canvas);
      const icon = new iconClass({ scale: 2 });
      const group = icon.getGroup();
      group.position = paper.view.center;

      iconElements.push({ key, canvas });
    });

    setIcons(iconElements);
  }, []);

  const downloadSVG = (key: string, canvas: HTMLCanvasElement) => {
    paper.setup(canvas);
    const svg = paper.project.exportSVG({ asString: true }) as string;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${key}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPNG = (key: string, canvas: HTMLCanvasElement) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${key}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const exportAll = async () => {
    setStatus('Exporting icons...');
    let count = 0;

    for (const { key, canvas } of icons) {
      downloadSVG(key, canvas);
      downloadPNG(key, canvas);
      count++;
      setStatus(`Exported ${count} of ${icons.length} icons...`);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setStatus(`Successfully exported ${count} icons! Check your downloads folder.`);
  };

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-4">
          Peplink Device Icon Exporter
        </h1>
        <p className="text-gray-300 mb-6">
          Click on individual icons to download as SVG or PNG, or export all at once.
        </p>

        <div className="mb-6">
          <button
            onClick={exportAll}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
          >
            Export All Icons
          </button>
          {status && (
            <div className="mt-4 p-4 bg-green-900 text-green-100 rounded">
              {status}
            </div>
          )}
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {icons.map(({ key, canvas }) => {
            const iconClass = IconRegistry.getIcon(key);
            if (!iconClass) return null;

            const instance = new iconClass();
            const series = instance.getSeries();
            instance.remove();

            return (
              <div key={key} className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-300 mb-2">{key}</h3>
                <p className="text-gray-400 text-sm mb-4">Series: {series}</p>
                <div className="bg-white border border-gray-600 rounded mb-4">
                  <img
                    src={canvas.toDataURL()}
                    alt={key}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadSVG(key, canvas)}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition"
                  >
                    Download SVG
                  </button>
                  <button
                    onClick={() => downloadPNG(key, canvas)}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition"
                  >
                    Download PNG
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
