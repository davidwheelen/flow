import { PeplinkDevice } from '@/types/network.types';
import IsometricCanvas from '../IsometricCanvas/IsometricCanvas';
import styles from './NetworkDiagram.module.css';

interface NetworkDiagramProps {
  devices: PeplinkDevice[];
}

function NetworkDiagram({ devices }: NetworkDiagramProps) {
  return (
    <div className={styles.container}>
      <IsometricCanvas devices={devices} />
    </div>
  );
}

export default NetworkDiagram;
