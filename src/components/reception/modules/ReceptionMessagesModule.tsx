import React from 'react';
import { CommunicationsModule } from '../../shared/communications/CommunicationsModule';

interface Props {
  onToast?: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const ReceptionMessagesModule: React.FC<Props> = ({ onToast }) => (
  <CommunicationsModule variant="receptionist" onToast={onToast} />
);
