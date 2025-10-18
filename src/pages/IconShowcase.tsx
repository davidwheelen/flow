import { useEffect, useRef } from 'react';
import paper from 'paper';
import { IconRegistry } from '@/lib/flow-renderer/icons/IconRegistry';

export function IconShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const allIcons = IconRegistry.getAllIcons();
    const scopes: paper.PaperScope[] = [];
    
    allIcons.forEach(({ key, iconClass }) => {
      const card = document.createElement('div');
      card.className = 'bg-gray-700 border border-gray-600 rounded-lg p-6';
      
      // Get series info from a temporary instance
      const tempScope = new paper.PaperScope();
      const tempCanvas = document.createElement('canvas');
      tempScope.setup(tempCanvas);
      const tempInstance = new iconClass();
      const series = tempInstance.getSeries();
      tempInstance.remove();
      
      const title = document.createElement('h3');
      title.className = 'text-xl font-semibold text-blue-300 mb-2';
      title.textContent = key;
      
      const seriesLabel = document.createElement('p');
      seriesLabel.className = 'text-gray-400 text-sm mb-4';
      seriesLabel.textContent = `Series: ${series}`;
      
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      canvas.className = 'bg-white border border-gray-600 rounded w-full';
      
      // Create a new scope for this icon
      const scope = new paper.PaperScope();
      scope.setup(canvas);
      scopes.push(scope);
      
      // Render icon on canvas with its own scope
      scope.activate();
      const icon = new iconClass({ scale: 2 });
      const group = icon.getGroup();
      group.position = scope.view.center;
      
      card.appendChild(title);
      card.appendChild(seriesLabel);
      card.appendChild(canvas);
      
      containerRef.current?.appendChild(card);
    });

    // Cleanup
    return () => {
      scopes.forEach(scope => {
        scope.project.clear();
      });
    };
  }, []);

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-4">
          Peplink Device Icons - Detailed 3D View
        </h1>
        <p className="text-gray-300 mb-6">
          Each icon features detailed visual elements including LEDs, ports, labels, and connectivity indicators.
        </p>

        <div 
          ref={containerRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        />
      </div>
    </div>
  );
}
