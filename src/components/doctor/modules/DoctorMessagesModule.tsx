import React from 'react';
import { CommunicationsModule } from '../../shared/communications/CommunicationsModule';

interface Props {
  onToast?: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const DoctorMessagesModule: React.FC<Props> = ({ onToast }) => (
  <CommunicationsModule variant="doctor" onToast={onToast} />
);
