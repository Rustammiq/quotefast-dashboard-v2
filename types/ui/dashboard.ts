
export interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Quote {
  id: string;
  customerName: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  date: string;
}

export interface Invoice {
  id: string;
  customerName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
}
