import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { AccountModal } from './AccountModal';
import { ChevronDown, User } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const [showAccount, setShowAccount] = useState(false);

  return (
    <>
    </>
  );
};
