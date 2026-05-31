import React from 'react';
import { CommunicationsModule } from '../../shared/communications/CommunicationsModule';

interface Props {
  onToast?: (type: 'success' | 'error', msg: string) => void;
}

export const AmbulanceMessagesModule: React.FC<Props> = () => (
  <CommunicationsModule variant="ambulance" />
);
