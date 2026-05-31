import React from 'react';
import { CommunicationsModule } from '../shared/communications/CommunicationsModule';

export const MessagesModule: React.FC<{ onToast?: (type: 'success' | 'error' | 'info', msg: string) => void }> = ({
  onToast,
}) => <CommunicationsModule variant="admin" onToast={onToast} />;
