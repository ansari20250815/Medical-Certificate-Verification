import DashboardIcon from '@mui/icons-material/Dashboard'
import DescriptionIcon from '@mui/icons-material/Description'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount' // Add an icon for manager

export const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <DashboardIcon />,
  },
  {
    label: 'Manage Leaves',
    icon: <DescriptionIcon />,
    children: [
      {
        label: 'Apply Leave',
        href: '/documents/form',
      },
      {
        label: 'Find Users',
        href: '/documents/table',
      },
    ],
  },
  {
    label: 'Manager Dashboard',
    href: '/manager/',
    icon: <SupervisorAccountIcon />,
  },
]