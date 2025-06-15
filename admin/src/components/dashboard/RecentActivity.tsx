import React from 'react';
import { Users, Store } from 'lucide-react';

interface ActivityItem {
  id: number;
  type: 'driver' | 'restaurant';
  name: string;
  action: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface RecentActivityProps {
  items: ActivityItem[];
}

export const RecentActivity = ({ items }: RecentActivityProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIcon = (type: string) => {
    return type === 'driver' ? Users : Store;
  };

  return (
    <div className="mt-4 flow-root">
      <ul className="-mb-8">
        {items.map((item, itemIdx) => {
          const Icon = getIcon(item.type);
          return (
            <li key={item.id}>
              <div className="relative pb-8">
                {itemIdx !== items.length - 1 ? (
                  <span
                    className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">
                          {item.name}
                        </span>{' '}
                        {item.action}
                      </p>
                      <p className="text-sm text-gray-500">{item.time}</p>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}; 