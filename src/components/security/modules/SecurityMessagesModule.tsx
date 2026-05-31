import React from 'react';
import { CommunicationsModule } from '../../shared/communications/CommunicationsModule';

interface Props {
  onToast?: (type: 'success' | 'error', msg: string) => void;
}

export const SecurityMessagesModule: React.FC<Props> = () => (
  <CommunicationsModule variant="security" />
);
