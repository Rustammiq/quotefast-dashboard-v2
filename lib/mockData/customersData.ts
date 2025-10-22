import { Customer } from '../../types/ui/dashboard';

export const mockCustomers: Customer[] = [
  {
    id: 'customer-1',
    name: 'ABC Bedrijf',
    email: 'contact@abcbedrijf.nl',
    phone: '+31 20 123 4567',
    company: 'ABC Bedrijf B.V.',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: 'customer-2',
    name: 'Maria Jansen',
    email: 'maria@jansen.nl',
    phone: '+31 30 987 6543',
    company: 'Jansen Design',
    createdAt: '2024-01-05T14:30:00Z',
    updatedAt: '2024-01-15T09:15:00Z'
  },
  {
    id: 'customer-3',
    name: 'TechStart',
    email: 'info@techstart.nl',
    phone: '+31 40 555 0123',
    company: 'TechStart Solutions',
    createdAt: '2024-01-15T11:20:00Z',
    updatedAt: '2024-01-25T16:45:00Z'
  },
  {
    id: 'customer-4',
    name: 'RetailPlus',
    email: 'dev@retailplus.nl',
    phone: '+31 10 777 8901',
    company: 'RetailPlus Group',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-28T13:20:00Z'
  },
  {
    id: 'customer-5',
    name: 'DataCorp',
    email: 'analytics@datacorp.nl',
    phone: '+31 50 222 3344',
    company: 'DataCorp Analytics',
    createdAt: '2024-01-08T12:30:00Z',
    updatedAt: '2024-01-18T10:45:00Z'
  },
  {
    id: 'customer-6',
    name: 'StartupXYZ',
    email: 'hello@startupxyz.nl',
    phone: '+31 70 111 2233',
    company: 'StartupXYZ',
    createdAt: '2024-01-03T09:15:00Z',
    updatedAt: '2024-01-13T14:30:00Z'
  },
  {
    id: 'customer-7',
    name: 'GlobalTech',
    email: 'marketing@globaltech.nl',
    phone: '+31 35 444 5566',
    company: 'GlobalTech Industries',
    createdAt: '2024-01-25T15:45:00Z',
    updatedAt: '2024-01-30T11:00:00Z'
  },
  {
    id: 'customer-8',
    name: 'Innovate Solutions',
    email: 'tech@innovatesolutions.nl',
    phone: '+31 15 666 7788',
    company: 'Innovate Solutions B.V.',
    createdAt: '2024-01-12T10:30:00Z',
    updatedAt: '2024-01-22T16:15:00Z'
  }
];

export const getCustomersStats = () => {
  const total = mockCustomers.length;
  const companies = mockCustomers.filter(c => c.company).length;
  const individuals = mockCustomers.filter(c => !c.company).length;

  return {
    total,
    companies,
    individuals
  };
};